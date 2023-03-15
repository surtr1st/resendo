import mongo, { model, ObjectId, Schema, Types } from 'mongoose';
import { TypeUser, User } from './user';

type TypeFriend = mongo.Document & {
  _id: ObjectId;
  user: Omit<TypeUser, 'password'>;
  friends: Array<Omit<TypeUser, 'password'>>;
};

interface IFriend {
  user: Omit<TypeUser, 'password'>;
  friends: Array<Omit<TypeUser, 'password'>>;
}

const schema = new Schema<TypeFriend>({
  user: {
    type: Types.ObjectId,
    ref: User,
    required: true,
  },
  friends: [
    {
      type: Types.ObjectId,
      ref: User,
      required: true,
    },
  ],
});

const Friend = model<TypeFriend>('Friend', schema);

export { TypeFriend, IFriend, Friend };
