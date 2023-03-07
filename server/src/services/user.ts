import { TypeUser, User } from '../models';

export class UserService {
  async findAll() {
    try {
      return await User.find();
    } catch (e) {
      throw new Error('Cannot return list of users');
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
