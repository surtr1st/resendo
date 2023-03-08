import mongo, { model, ObjectId, Schema } from 'mongoose';

type TypeUser = mongo.Document & {
  _id: ObjectId;
  username: string;
  password: string;
  email: string;
};

interface IUser {
  username: string;
  password: string;
  email: string;
}

const schema = new Schema<TypeUser>({
  username: String,
  password: String,
  email: String,
});

const User = model<TypeUser>('User', schema);

export { TypeUser, User, IUser };
