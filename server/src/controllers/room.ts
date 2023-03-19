import { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';
import { TypeRoom } from '../models';
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
    let loggedUser = {};
    service
      .findRoomByUserAndFriend(user, friend)
      .then((res) => (loggedUser = res))
      .catch(
        async () =>
          (loggedUser = await service.findRoomByUserAndFriend(friend, user)),
      )
      .then(async () => {
        const { _id, user1, user2, messages } = loggedUser as TypeRoom;
        const messagesInRoom = [];
        for (const message of messages) {
          const detailMessage = await messageService.findById(message._id);
          messagesInRoom.push(detailMessage);
        }
        const room = {
          _id,
          user1: await userService.findByIdExcludePassword(user1._id),
          user2: await userService.findByIdExcludePassword(user2._id),
          messages: messagesInRoom,
        };

        onServerResponse({
          statusCode: 200,
          headers: { contentType: 'application/json' },
          data: room,
        })(res);
      });
  };

  const findRooms = async (res: ServerResponse) => {
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: await service.findAll(),
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
        data: `${err}`,
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
      const { userId, partnerId } = JSON.parse(requestBody);
      const user1 = await userService.findById(userId as string);
      const user2 = partnerId
        ? await userService.findById(partnerId as string)
        : undefined;
      const room = {
        user1,
        user2,
      };

      onServerResponse({
        statusCode: 201,
        headers: { contentType: 'application/json' },
        data: await service.create(room),
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
        data: `${err}`,
      })(res);
    });

    req.on('end', async () => {
      const { roomId, messageId } = JSON.parse(requestBody);
      const newMessage = await messageService.findById(messageId);
      onServerResponse({
        statusCode: 201,
        headers: { contentType: 'application/json' },
        data: await service.patchMessage(roomId, newMessage),
      })(res);
    });
  };

  const joinRoom = async (roomId: string | ObjectId, res: ServerResponse) => {
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: await service.findById(roomId),
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
