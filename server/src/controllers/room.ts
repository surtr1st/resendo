import { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';
import { IRoom } from '../models';
import { RoomService, UserService } from '../services';

export function useRoomController() {
  const service = new RoomService();
  const userService = new UserService();
  const { onServerResponse } = useResponse();

  const findRoomsByUser = async (
    userId: string | ObjectId,
    res: ServerResponse,
  ) => {
    const user = await userService.findById(userId);
    const rooms = await service.findAllByUser(user);

    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: rooms,
    })(res);
  };

  const findRooms = async (res: ServerResponse) => {
    const rooms = await service.findAll();

    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: rooms,
    })(res);
  };

  const createRoom = (req: IncomingMessage, res: ServerResponse) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      const { userId, partnerId, title, type } = JSON.parse(body);
      const owner = await userService.findById(userId as string);
      const opponent = await userService.findById(partnerId as string);
      const room: Partial<IRoom> = {
        owner,
        opponent,
        title,
        type,
      };
      const newRoom = await service.create(room);

      onServerResponse({
        statusCode: 201,
        headers: { contentType: 'application/json' },
        data: newRoom,
      })(res);
    });
  };

  return {
    findRoomsByUser,
    findRooms,
    createRoom,
  };
}
