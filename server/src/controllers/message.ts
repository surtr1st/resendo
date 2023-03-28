import fs from 'fs';
import multer from 'multer';
import { v2 } from 'cloudinary';
import { Request, Response, Router } from 'express';
import {
  GroupService,
  MessageService,
  RoomService,
  UserService,
} from '../services';
import { CREATE_MESSAGE, MESSAGES_BY_USER_ID, UPLOAD_MEDIA } from '../routes';

export function MessageController() {
  const router = Router();
  const service = new MessageService();
  const userService = new UserService();
  const roomService = new RoomService();
  const groupService = new GroupService();
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  const MEDIA_FOLDER = 'media';
  if (!fs.existsSync(MEDIA_FOLDER)) fs.mkdirSync(MEDIA_FOLDER);

  // Find messages by user
  router.get(MESSAGES_BY_USER_ID, async (req: Request, res: Response) => {
    const { userId } = req.query;
    res.status(200).json(await service.findAllByUserId(userId as string));
  });

  // Create message
  router.post(CREATE_MESSAGE, async (req: Request, res: Response) => {
    const { content, userId, roomId, groupId } = req.body;
    const user = await userService.findById(userId as string);
    const newMessage = await service.create({
      content,
      user,
      author: user!.fullname,
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
  });

  // Configuration
  v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  const storage = multer.diskStorage({
    destination: function (
      _req: Request,
      _file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) {
      cb(null, MEDIA_FOLDER);
    },
    filename: function (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage });

  router.post(
    UPLOAD_MEDIA,
    upload.single('xfile'),
    async (req: Request, res: Response) => {
      const file = req.file;
      const { userId, roomId, groupId } = JSON.parse(req.body['xjson']);

      if (!file) {
        res.status(406).json({ message: 'File is undefined' });
        return;
      }

      // Upload
      v2.uploader.upload(`${MEDIA_FOLDER}/${file.filename}`, {
        public_id: file?.filename,
      });

      // Generate
      const url = v2.url(`${file.filename}`, {
        Crop: 'fill',
      });

      const user = await userService.findById(userId);
      const newMessage = await service.create({
        user,
        author: user.fullname,
        sentAt: new Date(),
        media: url,
      });
      if (groupId) await groupService.patchMessage(groupId, newMessage);
      else await roomService.patchMessage(roomId, newMessage);
      res.status(201).json(newMessage);
    },
  );

  return router;
}
