import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { connect } from 'mongoose';
import { useUserController } from './controllers';
import { GROUP, MEDIA, MESSAGE, METHOD, ROOM, USER } from './routes';

dotenv.config({});
const { HOST, PORT, MONGODB_URL } = process.env;
const port = parseInt(PORT as string);
const { findAll, createUser } = useUserController();
const httpServer = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    switch (req.url) {
      case USER:
        if (req.method === METHOD.GET) await findAll(res);
        if (req.method === METHOD.POST) createUser(req, res);
        break;

      case MESSAGE:
        break;

      case ROOM:
        break;

      case GROUP:
        break;

      case MEDIA:
        break;

      default:
        if (req.method === METHOD.POST) {
        }
        break;
    }
  },
);

function main() {
  connect(`${MONGODB_URL}`).then(
    () => {
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
