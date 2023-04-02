import mongo, { Schema, model, ObjectId } from 'mongoose';

type TypeQueue = mongo.Document & {
  _id: ObjectId;
  from: string | ObjectId;
  to: string | ObjectId;
  isAccepted: boolean;
  sentAt: Date;
};

interface IQueue {
  from: string | ObjectId;
  to: string | ObjectId;
  isAccepted: boolean;
  sentAt: Date;
}

const schema = new Schema<TypeQueue>({
  from: String,
  to: String,
  isAccepted: Boolean,
  sentAt: Date,
});

const Queue = model<TypeQueue>('Queue', schema);

export { TypeQueue, IQueue, Queue };
