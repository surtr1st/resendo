import { Request, Response, Router } from 'express';
import { MessageService, RoomService, UserService } from '../services';
import { MESSAGES, MESSAGE_BY_USER_ID } from '../routes';

export function MessageController() {
  const router = Router();
  const service = new MessageService();
  const userService = new UserService();
  const roomService = new RoomService();

  // Find all messages
  router.get(MESSAGES, async (req: Request, res: Response) =>
    res.status(200).json(await service.findAll()),
  );

  // Find messages by user
  router.get(MESSAGE_BY_USER_ID, async (req: Request, res: Response) => {
    const { userId } = req.query;
    const user = await userService.findById(userId as string);
    res.status(200).json(await service.findAllByUser(user));
  });

  // Create message
  router.post(MESSAGES, async (req: Request, res: Response) => {
    const { content, userId, roomId } = req.body;
    const newMessage = await service.create({
      content,
      user: await userService.findById(userId as string),
      sentAt: new Date(),
    });
    await roomService.patchMessage(roomId, newMessage);
    res.status(201).json(newMessage);
  });

  return router;
}
