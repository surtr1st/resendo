import mongo, { Schema, model, ObjectId } from 'mongoose';

type TypeRequestQueue = mongo.Document & {
  _id: ObjectId;
  from: string | ObjectId;
  to: string | ObjectId;
  isAccepted: boolean;
  sentAt: Date;
};

interface IRequestQueue {
  from: string | ObjectId;
  to: string | ObjectId;
  isAccepted: boolean;
  sentAt: Date;
}

const schema = new Schema<TypeRequestQueue>({
  from: String,
  to: String,
  isAccepted: Boolean,
  sentAt: Date,
});

const RequestQueue = model<TypeRequestQueue>('RequestQueue', schema);

export { TypeRequestQueue, IRequestQueue, RequestQueue };
