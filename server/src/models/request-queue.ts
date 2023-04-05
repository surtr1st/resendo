import mongo, { Schema, model, ObjectId, Types } from 'mongoose';
import { TypeUser, User } from './user';

type TypeRequestQueue = mongo.Document & {
  _id: ObjectId;
  from: TypeUser;
  to: string | ObjectId;
  isAccepted: boolean;
  requestAt: Date;
};

interface IRequestQueue {
  from: TypeUser;
  to: string | ObjectId;
  isAccepted: boolean;
  requestAt: Date;
}

const schema = new Schema<TypeRequestQueue>({
  from: {
    type: Types.ObjectId,
    ref: User,
    required: true,
  },
  to: String,
  isAccepted: Boolean,
  requestAt: Date,
});

const RequestQueue = model<TypeRequestQueue>('RequestQueue', schema);

export { TypeRequestQueue, IRequestQueue, RequestQueue };
