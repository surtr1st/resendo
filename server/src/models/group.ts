import mongo, { model, ObjectId, Schema } from 'mongoose';
import { IUser, User } from './user';

interface IGroup extends mongo.Document {
  _id: ObjectId;
  inviteId: string;
  title: string;
  owner: Omit<IUser, 'password'>;
  users: Array<Omit<IUser, 'password'>>;
  type: string;
}

const schema = new Schema<IGroup>({
  inviteId: String,
  title: String,
  owner: User,
  users: Array<IUser>,
  type: String,
});

const Group = model<IGroup>('Group', schema);

export { IGroup, Group };
