import { ObjectId } from 'mongoose';
import { INotificationQueue, NotificationQueue } from '../models';

export class NotifiationQueueService {
  async findAllBySender(senderId: string | ObjectId) {
    try {
      const queue = await NotificationQueue.findOne({ sender: senderId });
      if (!queue)
        throw new Error(
          `Cannot return list of notifications by sender: ${senderId}`,
        );
      return queue;
    } catch (e) {
      throw e;
    }
  }

  async createNotificationQueue(notify: Partial<INotificationQueue>) {
    try {
      const queue = await NotificationQueue.create(notify);
      return queue.id;
    } catch (e) {
      throw new Error('Cannot add to queue');
    }
  }

  async patchQueue(notify: Partial<INotificationQueue>) {
    try {
      const queue = await NotificationQueue.updateOne(
        { sender: notify.sender },
        { $push: { messages: notify.messages } },
      );
      return queue.modifiedCount;
    } catch (e) {
      throw new Error('Cannot update message queue');
    }
  }

  async clearOnSeen(sender: string | ObjectId) {
    try {
      return await NotificationQueue.updateOne(
        { sender },
        { $pullAll: { messages: [] } },
      );
    } catch (e) {
      throw new Error(`Cannot update seen by sender: ${sender}`);
    }
  }
}
