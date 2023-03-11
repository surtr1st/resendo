import { Document, model, ObjectId, Schema, Types } from 'mongoose';
import { TypeUser, User } from './user';

type TypeFriend = Document & {
  _id: ObjectId;
  user: Omit<TypeUser, 'password'>;
  friends: Array<Omit<TypeUser, 'password'>>;
};

interface IFriend {
  user: Omit<TypeUser, 'password'>;
  friends: Array<Omit<TypeUser, 'password'>>;
}

const schema = new Schema<TypeFriend>({
  user: User,
  friends: [
    {
      type: Types.ObjectId,
      ref: User,
      required: false,
    },
  ],
});

const Friend = model<TypeFriend>('Friend', schema);

export { TypeFriend, IFriend, Friend };
