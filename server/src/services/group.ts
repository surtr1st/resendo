import { ObjectId } from 'mongoose';
import { Group, IGroup, LatestMessage, TypeMessage, TypeUser } from '../models';

export class GroupService {
  async findAllByOwner(owner: string | ObjectId) {
    try {
      const group = await Group.find({ owner });
      if (!group) throw new Error('Cannot return list of groups by user');
      return group;
    } catch (e) {
      throw e;
    }
  }

  async findGroupsByMember(member: string | ObjectId) {
    try {
      const group = await Group.find({
        users: member,
      });
      if (!group)
        throw new Error(`Cannot return list of groups by member: ${member}`);
      return group;
    } catch (e) {
      throw e;
    }
  }

  async findById(id: string | ObjectId) {
    try {
      const group = await Group.findOne({ _id: id });
      if (!group) throw new Error(`Cannot find group with id: ${id}`);
      return group;
    } catch (e) {}
  }

  async create(group: Partial<IGroup>) {
    try {
      const createdGroup = await Group.create(group);
      return createdGroup.id;
    } catch (e) {
      throw new Error('Cannot create group');
    }
  }

  async addMember(id: string | ObjectId, user: TypeUser) {
    try {
      return await Group.updateOne({ _id: id }, { $push: { users: user } });
    } catch (e) {
      throw new Error('Cannot add member');
    }
  }

  async addMembers(id: string | ObjectId, users: Array<TypeUser>) {
    try {
      const group = await Group.findById(id);
      if (!group) throw new Error('Group not found');
      const updatedUsers = [...group.users, ...users];
      await Group.updateOne({ _id: id }, { users: updatedUsers });
      return updatedUsers;
    } catch (e) {
      throw new Error('Cannot add members');
    }
  }

  async removeMember(id: string | ObjectId, user: string | ObjectId) {
    try {
      return await Group.findOneAndRemove({ _id: id }, { users: user });
    } catch (e) {
      throw new Error(`Cannot remove member: ${user}`);
    }
  }

  async patchMessage(id: string | ObjectId, message: TypeMessage) {
    try {
      const updatedGroup = await Group.updateOne(
        { _id: id },
        { $push: { messages: message } },
      );
      return updatedGroup.modifiedCount;
    } catch (e) {
      throw new Error('Cannot update group');
    }
  }

  async patchLatestMessage(id: string | ObjectId, lastMessage: LatestMessage) {
    try {
      const updatedGroup = await Group.updateOne(
        { _id: id },
        { $set: { lastMessage } },
      );
      console.log(updatedGroup.modifiedCount);
      return updatedGroup.modifiedCount;
    } catch (e) {
      throw new Error('Cannot update group');
    }
  }

  async remove(id: string | ObjectId) {
    try {
      return await Group.deleteOne({ _id: id });
    } catch (e) {
      throw new Error(`Cannot remove group with id: ${id}`);
    }
  }
}
