import { ObjectId } from 'mongoose';
import { IRequestQueue, RequestQueue } from '../models';

export class RequestQueueService {
  async findAllByUser(user: string | ObjectId) {
    try {
      const queues = await RequestQueue.find({ to: user });
      if (!queues)
        throw new Error(`Cannot return list of queues of user: ${user}`);
      return queues;
    } catch (e) {
      throw e;
    }
  }

  async requestFriend(queue: Partial<IRequestQueue>) {
    try {
      const { id } = await RequestQueue.create(queue);
      return id;
    } catch (e) {
      throw new Error('Cannot send friend request');
    }
  }

  async accept(from: string | ObjectId, to: string | ObjectId) {
    try {
      return await RequestQueue.findOneAndUpdate(
        { from, to },
        { $set: { isAccepted: true } },
      );
    } catch (e) {
      throw new Error('Cannot accept friend request');
    }
  }

  async reject(from: string | ObjectId, to: string | ObjectId) {
    try {
      return await RequestQueue.findOneAndDelete({ from, to });
    } catch (e) {
      throw new Error('Cannot reject friend request');
    }
  }
}
