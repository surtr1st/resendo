import { Request, Response, Router } from 'express';
import { IRequestQueue } from '../models';
import {
  ACCEPT_REQUEST,
  FRIEND_REQUEST_QUEUES,
  REJECT_REQUEST,
  REQUEST_FRIEND,
} from '../routes';
import { RequestQueueService } from '../services';

export function RequestQueueController() {
  const router = Router();
  const service = new RequestQueueService();

  router.get(FRIEND_REQUEST_QUEUES, async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      res.status(200).json(await service.findAllByUser(userId as string));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.post(REQUEST_FRIEND, async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const { fromId } = req.body;
      const queue: Partial<IRequestQueue> = {
        from: fromId,
        to: userId as string,
        isAccepted: false,
        sentAt: new Date(),
      };
      res.status(201).json(await service.requestFriend(queue));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.post(ACCEPT_REQUEST, async (req: Request, res: Response) => {
    try {
      const { requestorId, confirmerId } = req.body;
      res.status(200).json(await service.accept(requestorId, confirmerId));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.delete(REJECT_REQUEST, async (req: Request, res: Response) => {
    try {
      const { requestorId, confirmerId } = req.body;
      res.status(200).json(await service.reject(requestorId, confirmerId));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  return router;
}
