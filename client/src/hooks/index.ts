// Staging
// export const BASE_URL = import.meta.env.VITE_STAGING_SERVER;

// Local
export const BASE_URL = import.meta.env.VITE_LOCAL_SERVER_API;
export const SERVER_URL = import.meta.env.VITE_LOCAL_SERVER;
export const SOCKET_AUTH_TOKEN = import.meta.env.VITE_SOCKET_AUTH_TOKEN;

export * from './socket';
export * from './auth';
export * from './user';
export * from './message';
export * from './room';
export * from './friend';
export * from './group';
