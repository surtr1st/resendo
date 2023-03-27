import path from 'path';
import multer from 'multer';
import { v2 } from 'cloudinary';
import { Request, Response, Router, Express } from 'express';
import { MediaService } from '../services';
import { UPLOAD_MEDIA } from '../routes';

export function MediaController() {
  const router = Router();
  const service = new MediaService();
  // Configuration
  // v2.config({
  //   cloud_name: 'dvecxbxzv',
  //   api_key: '967466941857629',
  //   api_secret: 'QNLOHpP63MrJ7tLq5DZlKezp2Rg',
  // });

  // SET STORAGE
  const storage = multer.diskStorage({
    filename: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) {
      cb(null, file.fieldname);
    },
  });

  const upload = multer({ storage: storage });

  router.post(
    UPLOAD_MEDIA,
    upload.single('public'),
    async (req: Request, res: Response) => {
      const file = req.file;
      if (!file) {
        res.status(406).json({ message: 'File is undefined' });
        return;
      }
      console.log(`Path: [${path.dirname(`${__dirname}/public/${file}`)}]`);
      console.log(`File: ${file}`);
      console.log(`Filename: ${file.filename}`);

      // Upload
      // v2.uploader.upload(
      //   path.dirname(`${__dirname}/public/${file}`),
      //   {
      //     public_id: file?.filename,
      //   },
      // );

      // // Generate
      // const url = v2.url(`${file?.filename}`, {
      //   Crop: 'fill',
      // });

      // await service.create({ src: url });
      res.status(200).send();
    },
  );

  return router;
}
