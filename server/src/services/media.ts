import { Media, TypeMedia, TypeMessage } from '../models';

export class MediaService {
  async findAllByMessage(message: TypeMessage) {
    try {
      return await Media.find({ message });
    } catch (e) {
      throw new Error('Cannot return list of medias by message');
    }
  }

  async create(media: TypeMedia) {
    try {
      const createdMedia = await Media.create(media);
      return createdMedia.id;
    } catch (e) {
      throw new Error('Cannot create media');
    }
  }
}
