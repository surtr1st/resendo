import { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';
import { IRoom } from '../models';
import { MessageService, RoomService, UserService } from '../services';

export function useRoomController() {
  const service = new RoomService();
  const userService = new UserService();
  const messageService = new MessageService();
  const { onServerResponse } = useResponse();

  const findMessagesInRoom = async (
    userId: string | ObjectId,
    friendId: string | ObjectId,
    res: ServerResponse,
  ) => {
    const user = await userService.findById(userId);
    const friend = await userService.findById(friendId);
    const room = await service.findRoomByUserAndFriend(user, friend);

    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: room,
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
      const requiredFields = ['userId', 'partnerId', 'title'];
      const missingFields = requiredFields.filter(
        (field) => !JSON.parse(requestBody)[field],
      );

      if (missingFields.length > 0) {
        return onServerResponse({
          statusCode: 406,
          headers: { contentType: 'application/json' },
          data: '',
        })(res);
      }
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

  const updateConversationInRoom = (
    req: IncomingMessage,
    res: ServerResponse,
  ) => {
    let requestBody = '';

    req.on('data', (chunk) => {
      requestBody += chunk;
    });

    req.on('error', (err) => {
      return onServerResponse({
        statusCode: 500,
        headers: { contentType: 'application/json' },
        data: err,
      })(res);
    });

    req.on('end', async () => {
      const { roomId, messageId } = JSON.parse(requestBody);
      const newMessage = await messageService.findById(messageId);
      const updatedRoom = await service.patchMessage(roomId, newMessage);

      onServerResponse({
        statusCode: 201,
        headers: { contentType: 'application/json' },
        data: updatedRoom,
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
    findMessagesInRoom,
    findRooms,
    createRoom,
    updateConversationInRoom,
    joinRoom,
  };
}
