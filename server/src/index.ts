import dotenv from 'dotenv';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { connect } from 'mongoose';
import {
  UserController,
  MessageController,
  RoomController,
  AuthController,
  FriendController,
  MediaController,
} from './controllers';
import { GroupController } from './controllers/group';

dotenv.config({});
const { HOST, PORT, MONGODB_URL } = process.env;
const port = parseInt(PORT as string);

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
      app.use(GroupController());
      app.use(MediaController());
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

      io.on('connection', (socket) => {
        function onJoinRoom() {
          // Joining a room
          socket.on('join-room', (data) => {
            socket.join(data);
          });
        }

        function onReceiveAndSendBack() {
          // Only show message to all users within room
          socket.on('from-client', async (data) => {
            try {
              await rateLimiter.consume(socket.handshake.address);
              socket.to(data.room).emit('from-server', data.message);
            } catch (e) {
              socket.emit('blocked', {
                'retry-ms': (e as RateLimiterRes).msBeforeNext,
              });
            }
          });
        }

        if (socket.recovered) {
          onJoinRoom();
          onReceiveAndSendBack();
          return;
        }
        onJoinRoom();
        onReceiveAndSendBack();
      });

      httpServer.listen(port, HOST);
      console.log(
        `-> Connected to database | Server running at port ${port} with host ${HOST}`,
      );
    },
    (err) => console.log(err),
  );
}

main();
