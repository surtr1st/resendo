import mongo, { model, ObjectId, Schema, Types } from 'mongoose';
import { IMessage, Message, TypeMessage } from './message';

type TypeNotifcationQueue = mongo.Document & {
  _id: ObjectId;
  messages: TypeMessage;
  sender: string | ObjectId;
};

interface INotificationQueue {
  messages: IMessage[];
  sender: string | ObjectId;
}

const schema = new Schema<TypeNotifcationQueue>({
  messages: [
    {
      type: Types.ObjectId,
      ref: Message,
    },
  ],
  sender: String,
});

const NotificationQueue = model<TypeNotifcationQueue>(
  'NotificationQueue',
  schema,
);

export { TypeNotifcationQueue, INotificationQueue, NotificationQueue };
