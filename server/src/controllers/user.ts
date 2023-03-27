import { Request, Response, Router } from 'express';
import { validateUser } from '../middlewares';
import {
  CREATE_USER,
  USERS_BY_NAME,
  USERS_EXCEPT_SELF,
  USER_BY_ID,
} from '../routes';
import { FriendService, UserService } from '../services';

export function UserController() {
  const router = Router();
  const service = new UserService();
  const friendService = new FriendService();

  // Find user by id
  router.get(USER_BY_ID, async (req: Request, res: Response) => {
    const { id } = req.query;
    res.status(200).json(await service.findByIdExcludePassword(id as string));
  });

  // Find users except self
  router.get(USERS_EXCEPT_SELF, async (req: Request, res: Response) => {
    const { except } = req.query;
    res.status(200).json(await service.findExcludeSelf(except as string));
  });

  // Create user
  router.post(
    CREATE_USER,
    validateUser,
    async (req: Request, res: Response) => {
      const newUser = await service.create(req.body);
      await friendService.create({ user: await service.findById(newUser) });
      res.status(201).json(newUser);
    },
  );

  // Find user by name
  router.post(USERS_BY_NAME, async (req: Request, res: Response) => {
    const { name } = req.query;
    res.status(200).json(await service.findByName(name as string));
  });

  return router;
}
