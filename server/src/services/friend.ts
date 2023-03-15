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
  async findFriendsByUser(user: Omit<TypeUser, 'password'>) {
    try {
      const validUser = await Friend.findOne({ user });
      if (!validUser)
        throw new Error(`Cannot return list friends by user: ${user.id}`);
      return validUser.friends;
    } catch (e) {
      throw e;
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

  async isAdded(user: TypeUser, friend: string | ObjectId) {
    try {
      const beFriended = await Friend.findOne({
        user,
        friends: { _id: friend },
      });
      return beFriended ? true : false;
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

  async patchFriend(user: TypeUser, friend: TypeUser) {
    try {
      const updatedFriend = await Friend.updateOne(
        { user },
        {
          $push: { friends: friend },
        },
      );
      if (!updatedFriend) throw new Error('Cannot patch friend');
      return updatedFriend.modifiedCount;
    } catch (e) {
      throw e;
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
