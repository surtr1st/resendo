import mongo, { model, ObjectId, Schema } from 'mongoose';

type TypeUser = mongo.Document & {
  _id: ObjectId;
  fullname: string;
  password: string;
  email: string;
};

interface IUser {
  fullname: string;
  password: string;
  email: string;
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
});

const User = model<TypeUser>('User', schema);

export { TypeUser, User, IUser };
