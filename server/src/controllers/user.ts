import { Request, Response, Router } from 'express';
import { validateUser } from '../middlewares';
import { USERS, USER_BY_ID, USER_BY_NAME, USERS_EXCEPT_SELF } from '../routes';
import { FriendService, UserService } from '../services';

export function UserController() {
  const router = Router();
  const service = new UserService();
  const friendService = new FriendService();

  // Find all users
  router.get(USERS, async (req: Request, res: Response) =>
    res.status(200).json(await service.findAll()),
  );

  // Find user by id
  router.get(USER_BY_ID, async (req: Request, res: Response) => {
    const { userId } = req.query;
    res
      .status(200)
      .json(await service.findByIdExcludePassword(userId as string));
  });

  // Find users except self
  router.get(USERS_EXCEPT_SELF, async (req: Request, res: Response) => {
    const { except } = req.query;
    res.status(200).json(await service.findExcludeSelf(except as string));
  });

  // Find user by name
  router.get(USER_BY_NAME, async (req: Request, res: Response) => {
    const { keyword } = req.query;
    res.status(200).json(await service.findByName(keyword as string));
  });

  // Create user
  router.post(USERS, validateUser, async (req: Request, res: Response) => {
    const newUser = await service.create(req.body);
    await friendService.create({ user: await service.findById(newUser) });
    res.status(201).json(newUser);
  });

  return router;
}
