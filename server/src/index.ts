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
  FRIEND_BY_USER_ID,
  MESSAGE,
  MESSAGE_BY_USER_ID,
  METHOD,
  ROOM,
  ROOM_BY_ID,
  ROOM_BY_USER_ID,
  USER,
  USER_BY_ID,
  USER_BY_NAME,
  USER_EXCEPT_ID,
} from './routes';
import { validateUser } from './middlewares';

dotenv.config({});
const { HOST, PORT, MONGODB_URL } = process.env;
const port = parseInt(PORT as string);

function main() {
  connect(`${MONGODB_URL}`).then(
    () => {
      const { authenticate } = useAuthController();
      const {
        findUsers,
        findUsersWithoutSelf,
        findUserByName,
        findUser,
        createUser,
      } = useUserController();
      const { findMessages, findMessagesByUser, createMessage } =
        useMessageController();
      const {
        findRooms,
        findMessagesInRoom,
        createRoom,
        updateConversationInRoom,
      } = useRoomController();
      const { findFriends, findFriendsByUser, checkIfAdded, updateFriends } =
        useFriendController();
      const { handleRequest } = useResponse();

      // Initialize server
      const httpServer = createServer(
        async (req: IncomingMessage, res: ServerResponse) => {
          const urlParts = url.parse(`${req.url}`);
          const query = querystring.parse(`${urlParts.query}`);
          const { userId, roomId, friendId, except, name } = query;

          if (req.method === METHOD.OPTIONS) handleRequest(res);

          switch (req.url) {
            case USER:
              if (req.method === METHOD.GET) await findUsers(res);
              if (req.method === METHOD.POST) createUser(req, res);
              break;

            case `${USER_BY_ID}=${userId}`:
              if (req.method === METHOD.GET)
                await findUser(userId as string, res);
              break;

            case `${USER_BY_NAME}=${name}`:
              if (req.method === METHOD.POST)
                await findUserByName(name as string, res);
              break;

            case `${USER_EXCEPT_ID}=${except}`:
              if (req.method === METHOD.GET)
                await findUsersWithoutSelf(except as string, res);
              break;

            case MESSAGE:
              if (req.method === METHOD.GET) await findMessages(res);
              if (req.method === METHOD.POST) await createMessage(req, res);
              break;

            case `${MESSAGE_BY_USER_ID}=${userId}`:
              if (req.method === METHOD.GET)
                validateUser(userId as string, res, () =>
                  Promise.resolve(findMessagesByUser(userId as string, res)),
                );
              break;

            case ROOM:
              if (req.method === METHOD.GET) await findRooms(res);
              if (req.method === METHOD.POST) createRoom(req, res);
              break;

            case `${ROOM_BY_USER_ID}=${userId}&friendId=${friendId}`:
              if (req.method === METHOD.GET)
                validateUser(userId as string, res, () =>
                  Promise.resolve(
                    findMessagesInRoom(
                      userId as string,
                      friendId as string,
                      res,
                    ),
                  ),
                );
              break;

            case `${ROOM_BY_ID}=${roomId}`:
              if (req.method === METHOD.PATCH)
                updateConversationInRoom(req, res);
              break;

            case FRIEND:
              if (req.method === METHOD.GET) await findFriends(res);
              if (req.method === METHOD.POST) checkIfAdded(req, res);
              break;

            case `${FRIEND_BY_USER_ID}=${userId}`:
              if (req.method === METHOD.GET)
                validateUser(userId as string, res, () =>
                  Promise.resolve(findFriendsByUser(userId as string, res)),
                );
              if (req.method === METHOD.PATCH)
                validateUser(userId as string, res, () =>
                  updateFriends(userId as string, req, res),
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
          socket.to(data.room).emit('from-server', data.message);
        });
      });

      httpServer.listen(port, HOST);
      console.log(`-> Connected to database | Server running at port ${port}`);
    },
    (err) => console.log(err),
  );
}

main();
