import mongo, { model, ObjectId, Schema } from 'mongoose';

type TypeMedia = mongo.Document & {
  _id: ObjectId;
  src: string;
};

interface IMedia {
  src: string;
}

const schema = new Schema<TypeMedia>({
  src: String,
});

const Media = model<TypeMedia>('Media', schema);

export { TypeMedia, Media, IMedia };
