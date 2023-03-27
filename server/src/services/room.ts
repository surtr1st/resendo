import { ObjectId } from 'mongoose';
import { Room, IRoom, TypeMessage } from '../models';

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
      const room = await Room.findOne({ _id: id });
      return room;
    } catch (e) {
      throw new Error(`Cannot find room by id: ${id}`);
    }
  }

  async findRoomByUserAndFriend(
    user: string | ObjectId,
    friend: string | ObjectId,
  ) {
    try {
      const room = await Room.findOne({
        user1: user,
        user2: friend,
      });

      if (!room) throw new Error('Cannot return messages of room by user');
      return room;
    } catch (e) {
      throw e;
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

  async patchMessage(id: string | ObjectId, message: TypeMessage) {
    try {
      const updatedRoom = await Room.updateOne(
        { _id: id },
        { $push: { messages: message } },
      );
      return updatedRoom.modifiedCount;
    } catch (e) {
      throw new Error('Cannot update room');
    }
  }

  async remove(id: ObjectId) {
    try {
      return await Room.deleteOne({ _id: id });
    } catch (e) {
      throw new Error('Cannot remove room');
    }
  }
}
