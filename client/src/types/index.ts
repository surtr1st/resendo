export type AccessToken = string;
export type AuthenticationArgs = {
  email: string;
  password: string;
};
export type AuthorizeResponse = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};
export type User = {
  fullname: string;
  email: string;
  password: string;
};
export type Message = {
  content: string;
  userId: string;
  sentAt?: Date;
};
export type Room = {
  title: string;
  userId: string;
  partnerId: string;
  type: 'PUBLIC' | 'PRIVATE';
};
