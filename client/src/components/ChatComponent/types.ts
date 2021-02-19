import { History } from "history";

export type props = {
  history: History;
};

export type Conversation = {
  id: string;
  creator: string;
  member: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  sts: string;
  lastMessage: string;
};

export type User = {
  id?: number;
  name: string;
  email: string;
  password?: string;
  address?: string;
  phone?: string;
  username?: string;
};

export type Message = {
  id: string;
  type: number;
  body: string;
  sender?: string;
  receiver?: string;
  conversationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  sts: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  userId: string;
  username: string;
  address: string;
  phone: string;
};
