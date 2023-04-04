import mongo, { model, ObjectId, Schema } from 'mongoose';

type TypeUser = mongo.Document & {
  _id: ObjectId;
  fullname: string;
  password: string;
  email: string;
  avatar: string;
  lastMessage: string;
};

interface IUser {
  fullname: string;
  password: string;
  email: string;
  avatar: string;
  lastMessage: string;
}

const schema = new Schema<TypeUser>({
  fullname: {
    type: String,
    index: true,
  },
  password: String,
  email: {
    type: String,
    unique: true,
    index: true,
  },
  avatar: String,
  lastMessage: String,
});

const User = model<TypeUser>('User', schema);

export { TypeUser, User, IUser };
