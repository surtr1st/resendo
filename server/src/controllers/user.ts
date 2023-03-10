import { IncomingMessage, ServerResponse } from 'http';
import { useResponse } from '../helpers';
import { UserService } from '../services';

export function useUserController() {
  const service = new UserService();
  const { onServerResponse } = useResponse();

  const findUsers = async (res: ServerResponse) => {
    const users = await service.findAll();

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

      onServerResponse({
        statusCode: 201,
        headers: { contentType: 'application/json' },
        data: newUser,
      })(res);
    });
  };

  return {
    findUsers,
    createUser,
  };
}
