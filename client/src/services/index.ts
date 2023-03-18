// Staging
export const BASE_URL = import.meta.env.VITE_STAGING_SERVER;

// Local
// export const BASE_URL = import.meta.env.VITE_LOCAL_SERVER;

export * from './socket';
export * from './auth';
export * from './user';
export * from './message';
export * from './room';
export * from './friend';
