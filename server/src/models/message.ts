import mongo, { model, ObjectId, Schema } from 'mongoose';
import { IUser, User } from './user';

interface IMessage extends mongo.Document {
  _id: ObjectId;
  content: string;
  user: Omit<IUser, 'password'>;
}

const schema = new Schema<IMessage>({
  content: String,
  user: User,
});

const Message = model<IMessage>('Message', schema);

export { IMessage, Message };
