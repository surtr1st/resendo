import { ObjectId } from 'mongoose';
import { IQueue, Queue } from '../models';

export class QueueService {
  async findAllByUser(user: string | ObjectId) {
    try {
      const queues = await Queue.find({ to: user });
      if (!queues)
        throw new Error(`Cannot return list of queues of user: ${user}`);
      return queues;
    } catch (e) {
      throw e;
    }
  }

  async requestFriend(queue: Partial<IQueue>) {
    try {
      const { id } = await Queue.create(queue);
      return id;
    } catch (e) {
      throw new Error('Cannot send friend request');
    }
  }

  async accept(from: string | ObjectId, to: string | ObjectId) {
    try {
      return await Queue.findOneAndUpdate(
        { from, to },
        { $set: { isAccepted: true } },
      );
    } catch (e) {
      throw new Error('Cannot accept friend request');
    }
  }

  async reject(from: string | ObjectId, to: string | ObjectId) {
    try {
      return await Queue.findOneAndDelete({ from, to });
    } catch (e) {
      throw new Error('Cannot reject friend request');
    }
  }
}
