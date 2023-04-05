import dotenv from 'dotenv';
dotenv.config();

export const HOST = process.env.HOST;
export const PORT = parseInt(process.env.PORT as string);
export const MONGODB_URL = process.env.MONGODB_URL;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const REFRESH_SECRET = process.env.REFRESH_SECRET as string;
export const LOCAL_CLIENT = process.env.LOCAL_CLIENT as string;
export const STAGING_CLIENT = process.env.STAGING_CLIENT as string;
