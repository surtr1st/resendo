import mongo, { model, ObjectId, Schema, Types } from 'mongoose';
import { Message, TypeMessage } from './message';
import { TypeUser, User } from './user';

type TypeGroup = mongo.Document & {
  _id: ObjectId;
  title: string;
  owner: Omit<TypeUser, 'password'>;
  users: Array<Omit<TypeUser, 'password'>>;
  messages: Array<TypeMessage>;
  type: 'PRIVATE';
};

interface IGroup {
  title: string;
  owner: Omit<TypeUser, 'password'>;
  users: Array<Omit<TypeUser, 'password'>>;
  messages: Array<TypeMessage>;
  type: 'PRIVATE';
}

const schema = new Schema<TypeGroup>({
  title: String,
  owner: {
    type: Types.ObjectId,
    ref: User,
    required: true,
  },
  users: [
    {
      type: Types.ObjectId,
      ref: User,
    },
  ],
  messages: [
    {
      type: Types.ObjectId,
      ref: Message,
    },
  ],
  type: String,
});

const Group = model<TypeGroup>('Group', schema);

export { TypeGroup, Group, IGroup };
