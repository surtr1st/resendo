import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config({});

const { PORT } = process.env;

const port = parseInt(PORT as string);

const httpServer = createServer();

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

io.listen(port);
