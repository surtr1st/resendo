import mongo, { model, Schema, ObjectId } from 'mongoose';
import { IUser, User } from './user';

interface IRoom extends mongo.Document {
  _id: ObjectId;
  title: string;
  owner: Omit<IUser, 'password'>;
  opponent: Omit<IUser, 'password'>;
  type: string;
}

const schema = new Schema<IRoom>({
  title: String,
  owner: User,
  opponent: User,
  type: String,
});

const Room = model<IRoom>('Room', schema);

export { IRoom, Room };
