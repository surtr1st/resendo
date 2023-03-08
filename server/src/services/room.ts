import { ObjectId } from 'mongoose';
import { TypeUser, Room, IRoom } from '../models';

export class RoomService {
  async findAll() {
    try {
      return await Room.find({});
    } catch (e) {
      throw new Error('Cannot return list of rooms by user');
    }
  }
  async findAllByUser(user: Omit<TypeUser, 'password'>) {
    try {
      return await Room.find({ user });
    } catch (e) {
      throw new Error('Cannot return list of rooms by user');
    }
  }

  async create(room: Partial<IRoom>) {
    try {
      const createdRoom = await Room.create(room);
      return createdRoom.id;
    } catch (e) {
      throw new Error('Cannot create room');
    }
  }

  async remove(id: ObjectId) {
    try {
      return await Room.deleteOne({ id });
    } catch (e) {
      throw new Error('Cannot remove room');
    }
  }
}
