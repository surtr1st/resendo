import { ObjectId } from 'mongoose';
import { TypeUser, User } from '../models';

export class UserService {
  async findAll() {
    try {
      return await User.find({});
    } catch (e) {
      throw new Error('Cannot return list of users');
    }
  }

  async findById(id: string | ObjectId) {
    try {
      const user = await User.findById(id);
      if (!user) throw new Error(`Cannot return user with id: ${id}`);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async create(user: TypeUser) {
    try {
      const createdUser = await User.create(user);
      return createdUser.id;
    } catch (e) {
      throw new Error('Cannot create user');
    }
  }
}
