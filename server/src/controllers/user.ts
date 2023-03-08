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
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('error', (err) => console.log(err));
    req.on('end', async () => {
      const user = JSON.parse(body);
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
