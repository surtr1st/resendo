import { IncomingMessage, ServerResponse } from 'http';
import { UserService } from '../services';

export function useUserController() {
  const service = new UserService();

  const findAll = async (res: ServerResponse) => {
    const users = await service.findAll();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(users));
    res.end();
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
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(newUser));
      res.end();
    });
  };

  return {
    findAll,
    createUser,
  };
}
