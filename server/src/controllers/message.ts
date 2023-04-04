import path from 'path';
import { Request, Response, Router } from 'express';
import {
  GroupService,
  MessageService,
  RoomService,
  UserService,
} from '../services';
import { CREATE_MESSAGE, MESSAGES_BY_USER_ID, UPLOAD_MEDIA } from '../routes';
import { cloudinary, MEDIA_FOLDER, upload } from '../multipart';

export function MessageController() {
  const router = Router();
  const service = new MessageService();
  const userService = new UserService();
  const roomService = new RoomService();
  const groupService = new GroupService();

  // Find messages by user
  router.get(MESSAGES_BY_USER_ID, async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      res.status(200).json(await service.findAllByUserId(userId as string));
    } catch (e) {
      res.status(500).json({ message: e });
    }
  });

  // Create message
  router.post(CREATE_MESSAGE, async (req: Request, res: Response) => {
    try {
      const { content, userId, roomId, groupId } = req.body;
      const user = await userService.findById(userId);
      if (!user) return res.status(400).json({ message: 'Not found' });
      const newMessage = await service.create({
        content,
        user,
        author: user.fullname,
        sentAt: new Date(),
      });
      if (groupId) {
        await groupService.patchMessage(groupId, newMessage);
        await groupService.patchLatestMessage(groupId, {
          sender: user.fullname,
          content,
        });
      } else {
        await userService.findAndPatch(userId as string, content);
        await roomService.patchMessage(roomId, newMessage);
      }
      res.status(201).json(newMessage);
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.post(
    UPLOAD_MEDIA,
    upload.single('xfile'),
    async (req: Request, res: Response) => {
      try {
        const file = req.file;
        const { userId, roomId, groupId } = JSON.parse(req.body['xjson']);

        if (!file) {
          res.status(406).json({ message: 'File is undefined' });
          return;
        }

        // Upload
        cloudinary.uploader.upload(`${MEDIA_FOLDER}/${file.filename}`, {
          public_id: file?.filename,
        });

        // Generate
        const url = cloudinary.url(`${file.filename}`, {
          Crop: 'fill',
        });

        const user = await userService.findById(userId);
        const newMessage = await service.create({
          user,
          author: user.fullname,
          sentAt: new Date(),
          media: `${url}${path.extname(file.originalname)}`,
        });
        if (groupId) await groupService.patchMessage(groupId, newMessage);
        else await roomService.patchMessage(roomId, newMessage);
        res.status(201).json(newMessage);
      } catch (e) {
        res.status(500).json({ message: `${e}` });
      }
    },
  );

  return router;
}
