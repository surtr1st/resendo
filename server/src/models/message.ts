import mongo, { model, ObjectId, Schema, Types } from 'mongoose';
import { TypeUser, User } from './user';

type TypeMessage = mongo.Document & {
  _id: ObjectId;
  content: string;
  user: Omit<TypeUser, 'password'>;
};

interface IMessage {
  content: string;
  user: Omit<TypeUser, 'password'>;
}

const schema = new Schema<TypeMessage>({
  content: String,
  user: {
    type: Types.ObjectId,
    ref: User,
    required: true,
  },
});

const Message = model<TypeMessage>('Message', schema);

export { TypeMessage, Message, IMessage };
