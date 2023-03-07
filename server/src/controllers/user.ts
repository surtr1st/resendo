import { IncomingMessage, request } from 'http';
import { TypeUser } from '../models';
import { useUserRouter } from '../routes';
import { UserService } from '../services';

export function useUserController() {
  const service = new UserService();
  const { GET_USERS, POST_USER } = useUserRouter();

  const findAll = () => {
    return new Promise((resolve, reject) => {
      const req = request(GET_USERS, (res: IncomingMessage) => {
        res.on('end', async () => {
          const results = await service.findAll();
          resolve(results);
        });

        req.on('error', (err) => {
          reject(err);
        });

        req.end();
      });

      req.end();
    });
  };

  const createUser = (user: TypeUser) => {
    return new Promise((resolve, reject) => {
      const req = request(POST_USER, (res: IncomingMessage) => {
        res.on('end', async () => {
          const id = await service.create(user);
          resolve(id);
        });

        res.on('error', (err) => {
          reject(err);
        });
      });

      req.end();
    });
  };

  return {
    findAll,
    createUser,
  };
}
