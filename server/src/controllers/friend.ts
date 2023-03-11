import { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';
import { UserService } from '../services';
import { FriendService } from '../services/friend';

export function useFriendController() {
  const service = new FriendService();
  const userService = new UserService();
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
    const friends = await service.findAllByUser(user);
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: friends,
    })(res);
  };

  const createFriend = (req: IncomingMessage, res: ServerResponse) => {
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
      const { userId } = JSON.parse(requestBody);
      const user = await userService.findById(userId);
      const newFriend = await service.create({ user });
      onServerResponse({
        statusCode: 201,
        headers: { contentType: 'application/json' },
        data: newFriend,
      })(res);
    });
  };

  const updateFriends = (
    id: string | ObjectId,
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
      const { userId } = JSON.parse(requestBody);
      const user = await userService.findById(userId);
      const patchedFriend = await service.patchFriend(id, user);
      onServerResponse({
        statusCode: 201,
        headers: { contentType: 'application/json' },
        data: patchedFriend,
      })(res);
    });
  };

  return {
    findFriends,
    findFriendsByUser,
    createFriend,
    updateFriends,
  };
}
