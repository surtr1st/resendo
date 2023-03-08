import mongo, { model, ObjectId, Schema, Types } from 'mongoose';
import { TypeMessage, Message } from './message';

type TypeMedia = mongo.Document & {
  _id: ObjectId;
  src: string;
  message: TypeMessage;
};

interface IMedia {
  src: string;
  message: TypeMessage;
}

const schema = new Schema<TypeMedia>({
  src: String,
  message: {
    type: Types.ObjectId,
    ref: Message,
  },
});

const Media = model<TypeMedia>('Media', schema);

export { TypeMedia, Media, IMedia };
