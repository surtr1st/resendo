import bcrypt from 'bcrypt';
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

  async updateAvatar(id: string | ObjectId, avatar: string) {
    try {
      const patched = await User.updateOne({ _id: id }, { $set: { avatar } });
      if (!patched) throw new Error(`Cannot update avatar of user: ${id}`);
      return patched.modifiedCount;
    } catch (e) {
      throw e;
    }
  }

  async findAndPatch(id: string | ObjectId, message: string) {
    try {
      const patched = await User.updateOne(
        { _id: id },
        { $set: { lastMessage: message } },
      );
      if (!patched) throw new Error(`Cannot patch user with id: ${id}`);
      return patched.modifiedCount;
    } catch (e) {
      throw e;
    }
  }

  async findByIdExcludePassword(id: string | ObjectId) {
    try {
      const user = await User.findById(id).select('-password');
      if (!user) throw new Error(`Cannot return user with id: ${id}`);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async findExcludeSelf(selfId: string | ObjectId) {
    try {
      return await User.find({ _id: { $ne: selfId } });
    } catch (e) {
      throw e;
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error(`Cannot return user with email: ${email}`);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async findByName(name: string) {
    try {
      return await User.find({ fullname: { $regex: `.*${name}.*` } });
    } catch (e) {
      throw e;
    }
  }

  async create(user: TypeUser) {
    try {
      const newUser = {
        fullname: user.fullname,
        email: user.email,
        password: bcrypt.hashSync(user.password, 7),
      };
      const createdUser = await User.create(newUser);
      return createdUser.id;
    } catch (e) {
      throw new Error('Cannot create user');
    }
  }
}
