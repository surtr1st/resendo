import { Request, Response, Router } from 'express';
import { TypeRoom } from '../models';
import { MessageService, RoomService, UserService } from '../services';
import { ROOMS, ROOM_BY_ID, ROOM_BY_USER_ID_AND_FRIEND_ID } from '../routes';
import { validateRoom, validateUpdateRoom } from '../middlewares';

export function RoomController() {
  const router = Router();
  const service = new RoomService();
  const userService = new UserService();
  const messageService = new MessageService();

  // Find room by user and friend
  router.get(
    ROOM_BY_USER_ID_AND_FRIEND_ID,
    async (req: Request, res: Response) => {
      const { userId, friendId } = req.query;
      const user = await userService.findById(userId as string);
      const friend = await userService.findById(friendId as string);
      let loggedUser = {};
      service
        .findRoomByUserAndFriend(user, friend)
        .then((res) => (loggedUser = res))
        .catch(
          async () =>
            (loggedUser = await service.findRoomByUserAndFriend(friend, user)),
        )
        .then(async () => {
          const { _id, user1, user2, messages } = loggedUser as TypeRoom;
          const messagesInRoom = [];
          for (const message of messages) {
            const detailMessage = await messageService.findById(message._id);
            messagesInRoom.push(detailMessage);
          }
          const room = {
            _id,
            user1: await userService.findByIdExcludePassword(user1._id),
            user2: await userService.findByIdExcludePassword(user2._id),
            messages: messagesInRoom,
          };
          res.status(200).json(room);
        });
    },
  );

  // Find all rooms
  router.get(ROOMS, async (req: Request, res: Response) =>
    res.status(200).json(await service.findAll()),
  );

  // Create room
  router.post(ROOMS, validateRoom, async (req: Request, res: Response) => {
    const { userId, partnerId } = req.body;
    const user1 = await userService.findById(userId as string);
    const user2 = partnerId
      ? await userService.findById(partnerId as string)
      : undefined;
    const room = {
      user1,
      user2,
    };

    res.status(201).json(await service.create(room));
  });

  // Update message within room
  router.patch(
    ROOMS,
    validateUpdateRoom,
    async (req: Request, res: Response) => {
      const { roomId, messageId } = req.body;
      const newMessage = await messageService.findById(messageId);
      res.status(201).json(await service.patchMessage(roomId, newMessage));
    },
  );

  // Join room
  router.get(ROOM_BY_ID, async (req: Request, res: Response) => {
    const { roomId } = req.query;
    res.status(200).json(await service.findById(roomId as string));
  });

  return router;
}
