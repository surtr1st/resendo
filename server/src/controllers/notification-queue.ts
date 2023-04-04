import { Router, Request, Response } from 'express';
import { NOTIFICATION_QUEUES, ON_SEEN } from '../routes';
import { NotifiationQueueService } from '../services';

export function NotificationQueueController() {
  const router = Router();
  const service = new NotifiationQueueService();

  router.get(NOTIFICATION_QUEUES, async (req: Request, res: Response) => {
    try {
      const { sender } = req.query;
      const notifications = await service.findAllBySender(sender as string);
      res.status(200).json(notifications);
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.patch(NOTIFICATION_QUEUES, async (req: Request, res: Response) => {
    try {
      const { message, sender } = req.body;
      res.status(201).json(
        await service.patchQueue({
          message,
          sender,
        }),
      );
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.delete(ON_SEEN, async (req: Request, res: Response) => {
    try {
      const { senderId } = req.body;
      res.status(200).json(await service.clearOnSeen(senderId));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  return router;
}
