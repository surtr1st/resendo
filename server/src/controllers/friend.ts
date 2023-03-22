import { Request, Response, Router } from 'express';
import { validateFriend } from '../middlewares';
import { FRIENDS, FRIENDS_BY_USER_ID, FRIEND_BY_USER_ID } from '../routes';
import { RoomService, UserService } from '../services';
import { FriendService } from '../services/friend';

export function FriendController() {
  const router = Router();
  const service = new FriendService();
  const userService = new UserService();
  const roomService = new RoomService();

  // Find friends by user
  router.get(FRIEND_BY_USER_ID, async (req: Request, res: Response) => {
    const { userId } = req.query;
    const user = await userService.findById(userId as string);
    const friends = await service.findFriendsByUser(user);
    const userFriends = [];
    for (const friend of friends) {
      const detailFriend = await userService.findByIdExcludePassword(
        friend._id,
      );
      userFriends.push(detailFriend);
    }
    res.status(200).json(userFriends);
  });

  // Check if user added
  router.post(FRIENDS, validateFriend, async (req: Request, res: Response) => {
    const { userId, friendId } = req.body;
    const user = await userService.findById(userId);
    res.status(200).json(await service.isAdded(user, friendId));
  });

  // Update friends by user
  router.put(FRIENDS_BY_USER_ID, async (req: Request, res: Response) => {
    const { userId } = req.query;
    const { friendId } = req.body;
    const user = await userService.findById(userId as string);
    const friend = await userService.findById(friendId);
    // Update to self first
    await service.patchFriend(user, friend);
    // Then update to other
    await service.patchFriend(friend, user);
    const newRoom = {
      user1: user,
      user2: friend,
    };
    await roomService.create(newRoom);
    res.status(201).send();
  });

  return router;
}
