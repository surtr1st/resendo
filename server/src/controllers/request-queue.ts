import { Request, Response, Router } from 'express';
import { IRequestQueue } from '../models';
import {
  ACCEPT_REQUEST,
  FRIEND_REQUEST_QUEUES,
  IS_REQUEST_SENT,
  REJECT_REQUEST,
  REQUEST_FRIEND,
} from '../routes';
import { RequestQueueService, UserService } from '../services';

export function RequestQueueController() {
  const router = Router();
  const service = new RequestQueueService();
  const userService = new UserService();

  router.get(FRIEND_REQUEST_QUEUES, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const friendRequests = [];
      const requests = await service.findAllByUser(userId as string);
      for (const requestor of requests) {
        const { _id, from, to, requestAt } = requestor;
        friendRequests.push({
          _id,
          from,
          to,
          requestAt,
          user: await userService.findById(requestor.from._id),
        });
      }
      res.status(200).json(friendRequests);
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.post(REQUEST_FRIEND, async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const { fromId } = req.body;
      const requestor = await userService.findById(fromId);

      const queue: Partial<IRequestQueue> = {
        from: requestor,
        to: userId as string,
        isAccepted: false,
        sentAt: new Date(),
      };
      res.status(201).json(await service.requestFriend(queue));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.post(IS_REQUEST_SENT, async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const { fromId } = req.body;
      const requestor = await userService.findById(fromId);
      const isSent = await service.checkIfRequestSent(
        requestor,
        userId as string,
      );
      res.status(200).json(isSent);
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.patch(ACCEPT_REQUEST, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      res.status(200).json(await service.accept(id));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.delete(REJECT_REQUEST, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      res.status(200).json(await service.reject(id));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  return router;
}
