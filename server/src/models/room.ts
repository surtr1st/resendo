import mongo, { model, Schema, ObjectId, Types } from 'mongoose';
import { TypeUser, User } from './user';

type TypeRoom = mongo.Document & {
  _id: ObjectId;
  inviteId: string;
  title: string;
  owner: Omit<TypeUser, 'password'>;
  opponent: Omit<TypeUser, 'password'>;
  type: string;
};

interface IRoom {
  inviteId: string;
  title: string;
  owner: Omit<TypeUser, 'password'>;
  opponent: Omit<TypeUser, 'password'>;
  type: string;
}

const schema = new Schema<TypeRoom>({
  inviteId: String,
  title: String,
  owner: {
    type: Types.ObjectId,
    ref: User,
    required: true,
  },
  opponent: {
    type: Types.ObjectId,
    ref: User,
    required: false,
  },
  type: String,
});

const Room = model<TypeRoom>('Room', schema);

export { TypeRoom, Room, IRoom };