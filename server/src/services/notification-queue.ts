import { ObjectId } from 'mongoose';
import { INotificationQueue, NotificationQueue, TypeMessage } from '../models';

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

  async findBySender(sender: string | ObjectId) {
    try {
      const queue = await NotificationQueue.findOne({ sender });
      if (!queue) throw new Error('Cannot add to queue');
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

  async patchQueue(id: string | ObjectId, message: TypeMessage) {
    try {
      const queue = await NotificationQueue.updateOne(
        { _id: id },
        { $push: { messages: message } },
      );
      return queue;
    } catch (e) {
      throw new Error('Cannot update message queue');
    }
  }

  async clearOnSeen(id: string | ObjectId) {
    try {
      return await NotificationQueue.updateOne(
        { _id: id },
        { $set: { messages: [] } },
      );
    } catch (e) {
      throw new Error(`Cannot update seen by sender: ${id}`);
    }
  }
}
