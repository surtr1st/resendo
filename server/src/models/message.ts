import mongo, { model, ObjectId, Schema, Types } from 'mongoose';
import { TypeUser, User } from './user';

type TypeMessage = mongo.Document & {
  _id: ObjectId;
  content: string;
  user: Omit<TypeUser, 'password'>;
  author: string;
  sentAt: Date;
  media: string;
};

interface IMessage {
  content: string;
  user: Omit<TypeUser, 'password'>;
  sentAt: Date;
  media: string;
}

const schema = new Schema<TypeMessage>({
  content: String,
  user: {
    type: Types.ObjectId,
    ref: User,
    required: true,
    index: true,
  },
  author: String,
  sentAt: Date,
  media: String,
});

const Message = model<TypeMessage>('Message', schema);

export { TypeMessage, Message, IMessage };
