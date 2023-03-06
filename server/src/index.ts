import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config({});

const { PORT } = process.env;

const port = parseInt(PORT as string);

const io = new Server(port, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
  },
});

io.on('connection', (socket) => {
  socket.emit('from-server', 'worudo');
});

io.on('connection', (socket) => {
  socket.on('from-client', (arg) => {
    console.log(arg);
  });
});

io.listen(port);
