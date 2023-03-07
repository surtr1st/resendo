import { TypeMessage, TypeUser, Message } from '../models';

export class MessageService {
  async findAllByUser(user: TypeUser) {
    try {
      return await Message.find({ user });
    } catch (e) {
      throw new Error('Cannot return list of messages by user');
    }
  }

  async create(message: TypeMessage) {
    try {
      const createdMessage = await Message.create(message);
      return createdMessage.id;
    } catch (e) {
      throw new Error('Cannot create message');
    }
  }
}
