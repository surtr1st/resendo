import dotenv from 'dotenv';
import url from 'url';
import querystring from 'querystring';
import { Server } from 'socket.io';
import { connect } from 'mongoose';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { useResponse } from './helpers';
import { verifyToken } from './middlewares';
import {
  useUserController,
  useMessageController,
  useRoomController,
  useAuthController,
  useFriendController,
} from './controllers';
import {
  AUTH,
  FRIEND,
  FRIEND_BY_ID,
  FRIEND_BY_USER_ID,
  MESSAGE,
  MESSAGE_BY_USER_ID,
  METHOD,
  ROOM,
  ROOM_BY_ID,
  ROOM_BY_USER_ID,
  USER,
} from './routes';
import { validateMessageUndefined } from './middlewares/message';
import { validateRoomUndefined } from './middlewares/room';
import { validateUser } from './middlewares/user';

dotenv.config({});
const { HOST, PORT, MONGODB_URL } = process.env;
const port = parseInt(PORT as string);

function main() {
  connect(`${MONGODB_URL}`).then(
    () => {
      const { authenticate } = useAuthController();
      const { findUsers, createUser } = useUserController();
      const { findMessages, findMessagesByUser, createMessage } =
        useMessageController();
      const {
        findRooms,
        findRoomsByUser,
        createRoom,
        updateConversationInRoom,
      } = useRoomController();
      const { findFriends, findFriendsByUser, createFriend, updateFriends } =
        useFriendController();
      const { handleRequest } = useResponse();

      // Initialize server
      const httpServer = createServer(
        async (req: IncomingMessage, res: ServerResponse) => {
          const urlParts = url.parse(`${req.url}`);
          const query = querystring.parse(`${urlParts.query}`);
          const { userId, roomId, friendId } = query;

          if (req.method === METHOD.OPTIONS) handleRequest(res);

          switch (req.url) {
            case USER:
              if (req.method === METHOD.GET) await findUsers(res);
              if (req.method === METHOD.POST) createUser(req, res);
              break;

            case MESSAGE:
              if (req.method === METHOD.GET) await findMessages(res);
              if (req.method === METHOD.POST)
                validateMessageUndefined(req, res, () =>
                  createMessage(req, res),
                );
              break;

            case `${MESSAGE_BY_USER_ID}=${userId}`:
              if (req.method === METHOD.GET)
                validateUser(userId as string, res, () =>
                  Promise.resolve(findMessagesByUser(userId as string, res)),
                );
              break;

            case ROOM:
              if (req.method === METHOD.GET) await findRooms(res);
              if (req.method === METHOD.POST)
                validateRoomUndefined(req, res, () => createRoom(req, res));
              break;

            case `${ROOM_BY_USER_ID}=${userId}`:
              if (req.method === METHOD.GET)
                validateUser(userId as string, res, () =>
                  Promise.resolve(findRoomsByUser(userId as string, res)),
                );
              break;

            case `${ROOM_BY_ID}=${roomId}`:
              if (req.method === METHOD.PATCH)
                updateConversationInRoom(req, res);
              break;

            case FRIEND:
              if (req.method === METHOD.GET) await findFriends(res);
              break;

            case `${FRIEND_BY_ID}=${friendId}`:
              if (req.method === METHOD.PATCH)
                updateFriends(friendId as string, req, res);
              break;

            case `${FRIEND_BY_USER_ID}=${userId}`:
              if (req.method === METHOD.GET)
                validateUser(userId as string, res, () =>
                  Promise.resolve(findFriendsByUser(userId as string, res)),
                );
              if (req.method === METHOD.POST)
                validateUser(userId as string, res, () =>
                  createFriend(req, res),
                );
              break;

            case AUTH:
              if (req.method === METHOD.POST)
                verifyToken(req, res, () => authenticate(req, res));
              break;
          }
        },
      );

      // Initialize Socket server
      const io = new Server(httpServer, {
        cors: {
          origin: 'http://localhost:5173',
          credentials: true,
          optionsSuccessStatus: 200,
          allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        },
      });

      io.on('connection', (socket) => {
        // Joining a room
        socket.on('join-room', (data) => {
          socket.join(data);
        });

        // Only show message to all users within room
        socket.on('from-client', (data) => {
          socket.to(data.room).emit('from-server', data);
        });
      });

      httpServer.listen(port, HOST);
      console.log(`-> Connected to database | Server running at port ${port}`);
    },
    (err) => console.log(err),
  );
}

main();
