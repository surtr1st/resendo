import mongo, { model, Schema, ObjectId, Types } from 'mongoose';
import { Message, TypeMessage } from './message';
import { TypeUser, User } from './user';

type TypeRoom = mongo.Document & {
  _id: ObjectId;
  user1: Omit<TypeUser, 'password'>;
  user2: Omit<TypeUser, 'password'>;
  messages: Array<TypeMessage>;
  type: 'PRIVATE';
};

interface IRoom {
  user1: Omit<TypeUser, 'password'>;
  user2: Omit<TypeUser, 'password'>;
  messages: Array<TypeMessage>;
  type: 'PRIVATE';
}

const schema = new Schema<TypeRoom>({
  user1: {
    type: Types.ObjectId,
    ref: User,
    required: true,
    index: true,
  },
  user2: {
    type: Types.ObjectId,
    ref: User,
    required: true,
    index: true,
  },
  messages: [
    {
      type: Types.ObjectId,
      ref: Message,
    },
  ],
  type: String,
});

const Room = model<TypeRoom>('Room', schema);

export { TypeRoom, Room, IRoom };
