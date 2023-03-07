import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { connect } from 'mongoose';
import { useUserController } from './controllers';

dotenv.config({});
const { PORT, MONGODB_URL } = process.env;
const port = parseInt(PORT as string);
const { findAll, createUser } = useUserController();
const httpServer = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === '/api/users') {
      if (req.method === 'GET') {
        const users = await findAll();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(users));
        res.end();
      }
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          const user = JSON.parse(body);
          const newUser = createUser(user);
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(newUser));
          res.end();
        });
      }
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

      httpServer.listen(port);
      console.log(`-> Connected to database | Server running at port ${port}`);
    },
    (err) => console.log(err),
  );
}

main();
