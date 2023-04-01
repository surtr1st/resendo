export type AccessToken = string;
export type FriendArgs = {
  userId: string;
  friendId: string;
  accessToken: AccessToken;
};
export type RoomArgs = FriendArgs;
export type UserFilter = {
  keyword: string;
  userId: string;
  accessToken: AccessToken;
};
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
  lastMessage?: string;
};
export type UserResponse = {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  lastMessage?: string;
};
export type InsensitiveUserInfo = Omit<User, 'password'>;
export type InsensitiveResponseUserInfo = Omit<UserResponse, 'password'>;
export type Message = {
  content: string;
  userId: string;
  roomId?: string;
  groupId?: string;
  sentAt?: Date;
};
export type MessageResponse = {
  _id: string;
  content: string;
  user: string;
  author?: string;
  media?: string;
  type?: string;
  sentAt: Date;
};
export type Room = {
  userId: string;
  partnerId: string;
  messages: Partial<Message[]>;
};
export type Friend = {
  userId: string;
  friendId?: string;
};
export type LatestMessage = {
  sender: string;
  content: string;
};
export type RoomResponse = {
  _id: string;
  user1: InsensitiveResponseUserInfo;
  user2: InsensitiveResponseUserInfo;
  messages: Partial<MessageResponse[]>;
};
export type Group = {
  title: string;
  owner: string;
  users: string[];
};
export type GroupResponse = {
  _id: string;
  title: string;
  owner: InsensitiveResponseUserInfo;
  users: InsensitiveResponseUserInfo[];
  messages: Partial<MessageResponse[]>;
  lastMessage: LatestMessage;
};
