export type AccessToken = string;
export type AuthenticationArgs = {
  email: string;
  password?: string;
};
export type AuthorizeResponse = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};
export type User = {
  _id?: string;
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
  messages: Partial<Message[]>;
};
export type Friend = {
  userId: string;
  friendId?: string;
};
export type FriendResponse = {
  id: string;
  user: Omit<User, 'password'>;
};
export type RoomResponse = {
  id: string;
  owner: Omit<User, 'password'>;
  opponent: Omit<User, 'password'>;
  messages: Partial<Message[]>;
};
