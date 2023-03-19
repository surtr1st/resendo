import { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';
import { FriendService, UserService } from '../services';

export function useUserController() {
  const service = new UserService();
  const friendService = new FriendService();
  const { onServerResponse } = useResponse();

  const findUsers = async (res: ServerResponse) => {
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: await service.findAll(),
    })(res);
  };

  const findUser = async (userId: string | ObjectId, res: ServerResponse) => {
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: await service.findByIdExcludePassword(userId),
    })(res);
  };

  const findUsersWithoutSelf = async (
    userId: string | ObjectId,
    res: ServerResponse,
  ) => {
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: await service.findExcludeSelf(userId),
    })(res);
  };

  const findUserByName = async (keyword: string, res: ServerResponse) => {
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: await service.findByName(keyword),
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
      await friendService.create({ user: await service.findById(newUser) });

      onServerResponse({
        statusCode: 201,
        headers: { contentType: 'application/json' },
        data: newUser,
      })(res);
    });
  };

  return {
    findUsers,
    findUser,
    findUserByName,
    findUsersWithoutSelf,
    createUser,
  };
}
