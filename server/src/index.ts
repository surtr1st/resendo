import express from 'express';
import cors, { CorsOptions } from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { connect } from 'mongoose';
import { MONGODB_URL, PORT, HOST } from './config';
import {
  UserController,
  MessageController,
  RoomController,
  AuthController,
  FriendController,
  GroupController,
  RequestQueueController,
  NotificationQueueController,
} from './controllers';
import { UserService } from './services';

function main() {
  connect(`${MONGODB_URL}`).then(
    () => {
      // Initialize server
      const app = express();

      const corsOptions: CorsOptions = {
        origin: 'http://localhost:5173',
        // 'https://resendo-client.netlify.app',
        credentials: true,
        optionsSuccessStatus: 200,
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      };

      const limiter = rateLimit({
        windowMs: 3 * 60 * 1000, // 3 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 3 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      });

      app.use(cors(corsOptions));
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      app.use(limiter);

      app.use(UserController());
      app.use(MessageController());
      app.use(RoomController());
      app.use(FriendController());
      app.use(RequestQueueController());
      app.use(NotificationQueueController());
      app.use(GroupController());
      app.use(AuthController());

      const httpServer = createServer(app);

      // Initialize Socket server
      const io = new Server(httpServer, {
        cors: corsOptions,
        connectionStateRecovery: {
          // the backup duration of the sessions and the packets
          maxDisconnectionDuration: 1 * 60 * 1000,
          // whether to skip middlewares upon successful recovery
          skipMiddlewares: true,
        },
      });

      const rateLimiter = new RateLimiterMemory({
        points: 7,
        duration: 3,
      });

      const onlineUsers: {
        [key: string]: any;
      } = {};

      io.on('connection', (socket) => {
        const userService = new UserService();
        function onConnect() {
          // Adding id of user connected
          socket.on('online', (data) => {
            onlineUsers[data.userId] = data.isOnline;
            socket.emit('user-onlines', Object.keys(onlineUsers));
          });
        }

        function onDisconnect() {
          // Removing id of user just disconnected
          socket.on('disconnect', () => {
            const userId = Object.keys(onlineUsers).find(
              (key) => onlineUsers[key] === true,
            );
            if (userId) {
              delete onlineUsers[userId];
              socket.emit('user-onlines', Object.keys(onlineUsers));
            }
          });
        }

        function onJoinRoom() {
          // Joining a room
          socket.on('join-room', (data) => {
            socket.join(data);
          });
        }

        function onTyping() {
          // Showing typing each perspective
          socket.on('is-typing', async (data) => {
            const user = await userService.findById(data.userId);
            socket.to(data.room).emit('is-typing', {
              fullname: user.fullname,
              isTyping: data.isTyping,
            });
          });
        }

        function onGroupTyping() {
          // Showing typing each perspective
          socket.on('is-group-typing', async (data) => {
            const user = await userService.findById(data.userId);
            socket.to(data.room).emit('is-group-typing', {
              userId: data.userId,
              fullname: user.fullname,
              isTyping: data.isTyping,
            });
          });
        }

        function onReceiveAndSendBack() {
          // Only show message to all users within room id
          socket.on('from-client', async (data) => {
            try {
              await rateLimiter.consume(socket.handshake.address);
              io.to(data.room).emit('from-server', data.message);
            } catch (e) {
              socket.emit('blocked', {
                'retry-ms': (e as RateLimiterRes).msBeforeNext,
              });
            }
          });
        }

        function onEnqueuedNotifiations() {
          // Only show notification sent message to user within room id
          socket.on('notification-queue', async (data) => {
            socket.broadcast.emit('notification-queue', data.userId);
          });
        }

        function onGroupReceiveAndSendBack() {
          // Only show message to all users within room id
          socket.on('from-group-client', async (data) => {
            try {
              await rateLimiter.consume(socket.handshake.address);
              io.to(data.room).emit('from-group-server', data.message);
            } catch (e) {
              socket.emit('blocked', {
                'retry-ms': (e as RateLimiterRes).msBeforeNext,
              });
            }
          });
        }

        if (socket.recovered) {
          onConnect();
          onDisconnect();
          onJoinRoom();
          onTyping();
          onGroupTyping();
          onReceiveAndSendBack();
          onGroupReceiveAndSendBack();
          onEnqueuedNotifiations();
          return;
        }
        onConnect();
        onDisconnect();
        onJoinRoom();
        onTyping();
        onGroupTyping();
        onReceiveAndSendBack();
        onGroupReceiveAndSendBack();
        onEnqueuedNotifiations();
      });

      httpServer.listen(PORT, HOST);
      console.log(
        `-> Connected to database | Server running at port ${PORT} with host ${HOST}`,
      );
    },
    (err) => console.log(err),
  );
}

main();
