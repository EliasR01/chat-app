export type Message = {
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

export type Attachment = {
  id: string;
  messagesID: string;
  messages: string;
};

export type Conversation = {
  id: string;
  creator: string;
  member: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
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

export type State = {
  username?: string;
  messages: Message[];
  attachments?: Attachment[];
  conversations?: Conversation[];
  contacts?: Contact[];
  people?: User[];
};

export type Action = {
  type: string;
  payload: State;
  userId?: number;
};

export type Children = {
  children: React.ReactNode;
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
