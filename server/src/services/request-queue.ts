import { ObjectId } from 'mongoose';
import { IRequestQueue, RequestQueue, TypeUser } from '../models';

export class RequestQueueService {
  async findAllByUser(user: string | ObjectId) {
    try {
      const queues = await RequestQueue.find({
        to: user,
        isAccepted: false,
      }).exec();
      if (!queues)
        throw new Error(`Cannot return list of queues of user: ${user}`);
      return queues;
    } catch (e) {
      throw e;
    }
  }

  async checkIfRequestSent(from: TypeUser, to: string | ObjectId) {
    try {
      const isSent = await RequestQueue.findOne({ from, to });
      return isSent ? true : false;
    } catch (e) {
      throw new Error('Cannot check friend request');
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

  async accept(id: string | ObjectId) {
    try {
      return await RequestQueue.findOneAndUpdate(
        { _id: id },
        { $set: { isAccepted: true } },
      );
    } catch (e) {
      throw new Error('Cannot accept friend request');
    }
  }

  async reject(id: string | ObjectId) {
    try {
      return await RequestQueue.findOneAndDelete({ _id: id });
    } catch (e) {
      throw new Error('Cannot reject friend request');
    }
  }
}
