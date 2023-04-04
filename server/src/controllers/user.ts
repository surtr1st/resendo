import { Request, Response, Router } from 'express';
import { validateUser } from '../middlewares';
import { FriendService, UserService } from '../services';
import {
  CREATE_USER,
  UPDATE_AVATAR,
  USERS_BY_NAME,
  USERS_EXCEPT_SELF,
  USER_BY_ID,
} from '../routes';
import { cloudinary, MEDIA_FOLDER, upload } from '../multipart';
import path from 'path';

export function UserController() {
  const router = Router();
  const service = new UserService();
  const friendService = new FriendService();

  // Find user by id
  router.get(USER_BY_ID, async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      res.status(200).json(await service.findByIdExcludePassword(id as string));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  // Find users except self
  router.get(USERS_EXCEPT_SELF, async (req: Request, res: Response) => {
    try {
      const { except } = req.query;
      res.status(200).json(await service.findExcludeSelf(except as string));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  // Create user
  router.post(
    CREATE_USER,
    validateUser,
    async (req: Request, res: Response) => {
      try {
        const newUser = await service.create(req.body);
        await friendService.create({ user: await service.findById(newUser) });
        res.status(201).json(newUser);
      } catch (e) {
        res.status(500).json({ message: `${e}` });
      }
    },
  );

  // Find user by name
  router.post(USERS_BY_NAME, async (req: Request, res: Response) => {
    try {
      const { name } = req.query;
      res.status(200).json(await service.findByName(name as string));
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.patch(
    UPDATE_AVATAR,
    upload.single('xavatar'),
    async (req: Request, res: Response) => {
      try {
        const file = req.file;
        const { id } = req.params;
        if (!file) {
          res.status(406).json({ message: 'File is undefined' });
          return;
        }

        cloudinary.uploader.upload(`${MEDIA_FOLDER}/${file.filename}`, {
          public_id: file.filename,
        });

        const url = cloudinary.url(`${file.filename}`, {
          Crop: 'fill',
        });

        res
          .status(201)
          .json(
            await service.updateAvatar(
              id,
              `${url}${path.extname(file.originalname)}`,
            ),
          );
      } catch (e) {
        res.status(500).json({ message: `${e}` });
      }
    },
  );

  return router;
}
