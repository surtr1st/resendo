import dotenv from 'dotenv';
dotenv.config();

export const HOST = process.env.HOST;
export const PORT = parseInt(process.env.PORT as string);
export const MONGODB_URL = process.env.MONGODB_URL;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
