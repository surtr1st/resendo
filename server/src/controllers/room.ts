import { Request, Response, Router } from 'express';
import { TypeRoom } from '../models';
import { MessageService, RoomService, UserService } from '../services';
import { CREATE_ROOM, ROOM_BY_USER_ID_AND_FRIEND_ID } from '../routes';
import { validateRoom } from '../middlewares';

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
      let loggedUser = {};
      service
        .findRoomByUserAndFriend(userId as string, friendId as string)
        .then((res) => (loggedUser = res))
        .catch(
          async () =>
            (loggedUser = await service.findRoomByUserAndFriend(
              friendId as string,
              userId as string,
            )),
        )
        .then(async () => {
          const { _id, user1, user2, messages } = loggedUser as TypeRoom;
          const messagesInRoom = [];
          // Response only 12 messages for each request
          const limitedMessages =
            messages.length > 12
              ? messages.slice(messages.length - 12, messages.length)
              : messages;
          for (const message of limitedMessages) {
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

  // Create room
  router.post(
    CREATE_ROOM,
    validateRoom,
    async (req: Request, res: Response) => {
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
    },
  );

  return router;
}
