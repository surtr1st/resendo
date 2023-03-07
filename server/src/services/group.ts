import { ObjectId } from 'mongoose';
import { Group, TypeGroup, TypeUser } from '../models';

export class GroupService {
  async findAllByUser(user: TypeUser) {
    try {
      return await Group.find({ user });
    } catch (e) {
      throw new Error('Cannot return list of groups by user');
    }
  }

  async create(group: TypeGroup) {
    try {
      const createdGroup = await Group.create(group);
      return createdGroup.id;
    } catch (e) {
      throw new Error('Cannot create group');
    }
  }

  async remove(id: ObjectId) {
    try {
      return await Group.deleteOne({ id });
    } catch (e) {
      throw new Error(`Cannot remove group with id: ${id}`);
    }
  }
}
