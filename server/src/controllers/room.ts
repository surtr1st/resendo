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
    let requestBody = '';

    req.on('data', (chunk) => {
      requestBody += chunk;
    });

    req.on('error', (err) => {
      onServerResponse({
        statusCode: 500,
        headers: { contentType: 'application/json' },
        data: err,
      })(res);
    });

    req.on('end', async () => {
      const { userId, partnerId, title, type } = JSON.parse(requestBody);
      const owner = await userService.findById(userId as string);
      const opponent = partnerId
        ? await userService.findById(partnerId as string)
        : undefined;
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

  const joinRoom = async (roomId: string | ObjectId, res: ServerResponse) => {
    const room = await service.findById(roomId);
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: room,
    })(res);
  };

  return {
    findRoomsByUser,
    findRooms,
    createRoom,
    joinRoom,
  };
}
