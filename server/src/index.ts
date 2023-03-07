import dotenv from 'dotenv';
import url from 'url';
import querystring from 'querystring';
import { Server } from 'socket.io';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { connect } from 'mongoose';
import { useUserController } from './controllers';
import {
  GROUP,
  MEDIA,
  MESSAGE,
  MESSAGE_BY_USER_ID,
  METHOD,
  ROOM,
  USER,
} from './routes';
import { useMessageController } from './controllers/message';

dotenv.config({});
const { HOST, PORT, MONGODB_URL } = process.env;
const port = parseInt(PORT as string);

function main() {
  connect(`${MONGODB_URL}`).then(
    () => {
      const { findUsers, createUser } = useUserController();
      const { findMessages, findMessagesByUser, createMessage } =
        useMessageController();

      // Initialize server
      const httpServer = createServer(
        async (req: IncomingMessage, res: ServerResponse) => {
          const urlParts = url.parse(`${req.url}`);
          const query = querystring.parse(`${urlParts.query}`);

          switch (req.url) {
            case USER:
              if (req.method === METHOD.GET) await findUsers(res);
              if (req.method === METHOD.POST) createUser(req, res);
              break;

            case MESSAGE:
              if (req.method === METHOD.GET) await findMessages(res);
              if (req.method === METHOD.POST) createMessage(req, res);
              break;

            case `${MESSAGE_BY_USER_ID}=${query.userId}`:
              const { userId } = query;
              if (req.method === METHOD.GET)
                await findMessagesByUser(userId as string, res);
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
