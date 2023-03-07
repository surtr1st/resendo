import { ObjectId } from 'mongoose';
import { TypeRoom, TypeUser, Room } from '../models';

export class RoomService {
  async findAllByUser(user: TypeUser) {
    try {
      return await Room.find({ user });
    } catch (e) {
      throw new Error('Cannot return list of rooms by user');
    }
  }

  async create(room: TypeRoom) {
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
