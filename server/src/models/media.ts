import mongo, { model, ObjectId, Schema } from 'mongoose';
import { IMessage, Message } from './message';

interface IMedia extends mongo.Document {
  _id: ObjectId;
  src: string;
  message: IMessage;
}

const schema = new Schema<IMedia>({
  src: String,
  message: Message,
});

const Media = model<IMedia>('Media', schema);

export { IMedia, Media };
