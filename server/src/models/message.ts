import mongo, { model, ObjectId, Schema, Types } from 'mongoose';
import { Media, TypeMedia } from './media';
import { TypeUser, User } from './user';

type TypeMessage = mongo.Document & {
  _id: ObjectId;
  content: string;
  user: Omit<TypeUser, 'password'>;
  author: string;
  sentAt: Date;
  media: TypeMedia;
};

interface IMessage {
  content: string;
  user: Omit<TypeUser, 'password'>;
  sentAt: Date;
  media: TypeMedia;
}

const schema = new Schema<TypeMessage>({
  content: String,
  user: {
    type: Types.ObjectId,
    ref: User,
    required: true,
    index: true,
  },
  author: String,
  sentAt: Date,
  media: {
    type: Types.ObjectId,
    ref: Media,
    index: true,
  },
});

const Message = model<TypeMessage>('Message', schema);

export { TypeMessage, Message, IMessage };
