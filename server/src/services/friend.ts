import { ObjectId } from 'mongoose';
import { TypeUser } from '../models';
import { Friend, IFriend, TypeFriend } from '../models/friend';

export class FriendService {
  async findAll() {
    try {
      return await Friend.find({});
    } catch (e) {
      throw new Error('Cannot return list friends');
    }
  }
  async findAllByUser(user: Omit<TypeUser, 'password'>) {
    try {
      return await Friend.find({ user });
    } catch (e) {
      throw new Error(`Cannot return list friends by user: ${user.id}`);
    }
  }

  async findById(id: string | ObjectId) {
    try {
      const friend = await Friend.findOne({ id });
      if (!friend) throw new Error(`Cannot find friend with id: ${id}`);
      return friend;
    } catch (e) {
      throw e;
    }
  }

  async create(friend: Partial<TypeFriend>) {
    try {
      const createdFriend = await Friend.create(friend);
      return createdFriend.id;
    } catch (e) {
      throw new Error('Cannot create friend');
    }
  }

  async update(friend: IFriend) {
    try {
      const updatedFriend = await Friend.updateOne(friend);
      return updatedFriend.modifiedCount;
    } catch (e) {
      throw new Error('Cannot update friend');
    }
  }

  async patchFriend(id: string | ObjectId, user: TypeUser) {
    try {
      const updatedFriend = await Friend.updateOne({ id }, { $push: { user } });
      return updatedFriend.modifiedCount;
    } catch (e) {
      throw new Error('Cannot patch friend');
    }
  }

  async remove(id: string | ObjectId) {
    try {
      return await Friend.deleteOne({ id });
    } catch (e) {
      throw new Error(`Cannot delete friend with id: ${id}`);
    }
  }
}
