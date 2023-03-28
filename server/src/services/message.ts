import { ObjectId } from 'mongoose';
import { Message, IMessage } from '../models';

export class MessageService {
  async findAll() {
    try {
      return await Message.find({});
    } catch (e) {
      throw new Error('Cannot return list of messages by user');
    }
  }

  async findAllByUserId(user: string | ObjectId) {
    try {
      return await Message.find({ user });
    } catch (e) {
      throw new Error('Cannot return list of messages by user');
    }
  }

  async findById(id: string | ObjectId) {
    try {
      const message = await Message.findOne({ _id: id });
      if (!message) throw new Error(`Cannot return message by id: ${id}`);
      return message;
    } catch (e) {
      throw e;
    }
  }

  async create(message: Partial<IMessage>) {
    try {
      const createdMessage = await Message.create(message);
      return createdMessage;
    } catch (e) {
      throw new Error('Cannot create message');
    }
  }
}
