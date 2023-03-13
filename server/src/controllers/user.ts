import { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';
import { FriendService, UserService } from '../services';

export function useUserController() {
  const service = new UserService();
  const friendService = new FriendService();
  const { onServerResponse } = useResponse();

  const findUsers = async (res: ServerResponse) => {
    const users = await service.findAll();
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: users,
    })(res);
  };

  const findUsersWithoutSelf = async (
    userId: string | ObjectId,
    res: ServerResponse,
  ) => {
    const users = await service.findExcludeSelf(userId);
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: users,
    })(res);
  };

  const createUser = (req: IncomingMessage, res: ServerResponse) => {
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
      const user = JSON.parse(requestBody);
      const newUser = await service.create(user);
      const fromNewUser = await service.findById(newUser);
      await friendService.create({ user: fromNewUser });

      onServerResponse({
        statusCode: 201,
        headers: { contentType: 'application/json' },
        data: newUser,
      })(res);
    });
  };

  return {
    findUsers,
    findUsersWithoutSelf,
    createUser,
  };
}
