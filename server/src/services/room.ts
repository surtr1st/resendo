import { ObjectId } from 'mongoose';
import { TypeUser, Room, IRoom, TypeMessage } from '../models';

export class RoomService {
  async findAll() {
    try {
      return await Room.find({});
    } catch (e) {
      throw new Error('Cannot return list of rooms by user');
    }
  }

  async findById(id: string | ObjectId) {
    try {
      const room = await Room.findOne({ id });
      return room;
    } catch (e) {
      throw new Error(`Cannot find room by id: ${id}`);
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

  async update(room: Partial<IRoom>) {
    try {
      const updatedRoom = await Room.updateOne(room);
      return updatedRoom.modifiedCount;
    } catch (e) {
      throw new Error('Cannot update room');
    }
  }

  async patchMessage(id: string | ObjectId, message: TypeMessage) {
    try {
      const updatedRoom = await Room.updateOne(
        { id },
        { $push: { messages: message } },
      );
      return updatedRoom.modifiedCount;
    } catch (e) {
      throw new Error('Cannot update room');
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
