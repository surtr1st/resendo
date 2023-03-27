import { Request, Response, Router } from 'express';
import {
  GroupService,
  MessageService,
  RoomService,
  UserService,
} from '../services';
import { CREATE_MESSAGE, MESSAGES_BY_USER_ID } from '../routes';

export function MessageController() {
  const router = Router();
  const service = new MessageService();
  const userService = new UserService();
  const roomService = new RoomService();
  const groupService = new GroupService();

  // Find messages by user
  router.get(MESSAGES_BY_USER_ID, async (req: Request, res: Response) => {
    const { userId } = req.query;
    res.status(200).json(await service.findAllByUserId(userId as string));
  });

  // Create message
  router.post(CREATE_MESSAGE, async (req: Request, res: Response) => {
    const { content, userId, roomId, groupId } = req.body;
    const user = await userService.findById(userId as string);
    const newMessage = await service.create({
      content,
      user,
      author: user!.fullname,
      sentAt: new Date(),
    });
    if (groupId) await groupService.patchMessage(groupId, newMessage);
    else await roomService.patchMessage(roomId, newMessage);
    res.status(201).json(newMessage);
  });

  return router;
}
