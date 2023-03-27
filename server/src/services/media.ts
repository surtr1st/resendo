import { ObjectId } from 'mongoose';
import { IMedia, Media } from '../models';

export class MediaService {
  async findAllById(id: string | ObjectId) {
    try {
      return await Media.find({ _id: id });
    } catch (e) {
      throw new Error(`Cannot return list of media by id: ${id}`);
    }
  }

  async create(media: IMedia) {
    try {
      const createdMedia = await Media.create(media);
      return createdMedia.id;
    } catch (e) {
      throw new Error('Cannot create media');
    }
  }
}
