import mongo, { model, ObjectId, Schema, Types } from 'mongoose';
import { TypeUser, User } from './user';

type TypeGroup = mongo.Document & {
  _id: ObjectId;
  inviteId: string;
  title: string;
  owner: Omit<TypeUser, 'password'>;
  users: Array<Omit<TypeUser, 'password'>>;
  type: string;
};

const schema = new Schema<TypeGroup>({
  inviteId: String,
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
  type: String,
});

const Group = model<TypeGroup>('Group', schema);

export { TypeGroup, Group };
