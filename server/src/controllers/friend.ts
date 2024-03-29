import { Request, Response, Router } from 'express';
import { validateFriend } from '../middlewares';
import { FRIENDS_BY_USER_ID, IS_ADDED_FRIEND } from '../routes';
import { NotifiationQueueService, RoomService, UserService } from '../services';
import { FriendService } from '../services/friend';

export function FriendController() {
  const router = Router();
  const service = new FriendService();
  const userService = new UserService();
  const roomService = new RoomService();
  const notifyQueueService = new NotifiationQueueService();

  // Find friends by user
  router.get(FRIENDS_BY_USER_ID, async (req: Request, res: Response) => {
    try {
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
    } catch (e) {
      res.status(500).json({ message: e });
    }
  });

  // Check if user added
  router.post(
    IS_ADDED_FRIEND,
    validateFriend,
    async (req: Request, res: Response) => {
      try {
        const { userId, friendId } = req.body;
        const user = await userService.findById(userId);
        res.status(200).json(await service.isAdded(user, friendId));
      } catch (e) {
        res.status(500).json({ message: e });
      }
    },
  );

  // Update friends by user
  router.patch(FRIENDS_BY_USER_ID, async (req: Request, res: Response) => {
    try {
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
      await notifyQueueService.createNotificationQueue({
        messages: [],
        sender: `${userId}`,
      });
      await notifyQueueService.createNotificationQueue({
        messages: [],
        sender: `${friendId}`,
      });
      res.status(201).send();
    } catch (e) {
      res.status(500).json({ message: e });
    }
  });

  return router;
}
