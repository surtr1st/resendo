import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config({});

const io = new Server({});

io.on('connection', (socket) => {
  // ...
});

io.listen(3000);

async function main() {}

main();
