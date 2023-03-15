import { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';
import { IRoom } from '../models';
import { RoomService, UserService } from '../services';
import { FriendService } from '../services/friend';

export function useFriendController() {
  const service = new FriendService();
  const userService = new UserService();
  const roomService = new RoomService();
  const { onServerResponse } = useResponse();

  const findFriends = async (res: ServerResponse) => {
    const friends = await service.findAll();
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: friends,
    })(res);
  };

  const findFriendsByUser = async (
    userId: string | ObjectId,
    res: ServerResponse,
  ) => {
    const user = await userService.findById(userId);
    const friends = await service.findFriendsByUser(user);
    const userFriends = [];
    for (const friend of friends) {
      const detailFriend = await userService.findById(friend._id);
      userFriends.push(detailFriend);
    }
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: userFriends,
    })(res);
  };

  const checkIfAdded = (req: IncomingMessage, res: ServerResponse) => {
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
      const { userId, friendId } = JSON.parse(requestBody);
      const user = await userService.findById(userId);
      const isAdded = await service.isAdded(user, friendId);
      onServerResponse({
        statusCode: 200,
        headers: { contentType: 'application/json' },
        data: isAdded,
      })(res);
    });
  };

  const updateFriends = (
    userId: string | ObjectId,
    req: IncomingMessage,
    res: ServerResponse,
  ) => {
    let requestBody: NonNullable<string> = '';

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
      const { friendId } = JSON.parse(requestBody);
      const user = await userService.findById(userId);
      const friend = await userService.findById(friendId);
      // Update to self first
      await service.patchFriend(user, friend);
      // Then update to other
      await service.patchFriend(friend, user);
      const newRoom: Partial<IRoom> = {
        user1: user,
        user2: friend,
      };
      await roomService.create(newRoom);
      onServerResponse({
        statusCode: 200,
        headers: { contentType: 'application/json' },
        data: {},
      })(res);
    });
  };

  return {
    findFriends,
    findFriendsByUser,
    checkIfAdded,
    updateFriends,
  };
}
