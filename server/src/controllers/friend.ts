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
    const friends = await service.findFriendsByUser(user);
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: friends,
    })(res);
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
      const first = await service.patchFriend(user, friend);
      // Then update to other
      const second = await service.patchFriend(friend, user);
      console.log(first, second);
      onServerResponse({
        statusCode: 200,
        headers: { contentType: 'application/json' },
        data: { first, second },
      })(res);
    });
  };

  return {
    findFriends,
    findFriendsByUser,
    updateFriends,
  };
}
