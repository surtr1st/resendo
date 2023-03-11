import { ObjectId } from 'mongoose';
import { TypeUser, Message, IMessage } from '../models';

export class MessageService {
  async findAll() {
    try {
      return await Message.find({});
    } catch (e) {
      throw new Error('Cannot return list of messages by user');
    }
  }

  async findAllByUser(user: Omit<TypeUser, 'password'>) {
    try {
      return await Message.find({ user });
    } catch (e) {
      throw new Error('Cannot return list of messages by user');
    }
  }

  async findById(id: string | ObjectId) {
    try {
      const message = await Message.findOne({ id });
      if (!message) throw new Error('Cannot return list of messages by user');
      return message;
    } catch (e) {
      throw e;
    }
  }

  async create(message: IMessage) {
    try {
      const createdMessage = await Message.create(message);
      return createdMessage.id;
    } catch (e) {
      throw new Error('Cannot create message');
    }
  }
}
