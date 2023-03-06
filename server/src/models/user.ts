import mongo, { model, ObjectId, Schema } from 'mongoose';

interface IUser extends mongo.Document {
  _id: ObjectId;
  username: string;
  password: string;
  email: string;
}

const schema = new Schema<IUser>({
  username: String,
  password: String,
  email: String,
});

const User = model<IUser>('User', schema);

export { IUser, User };
