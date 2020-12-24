export type Message = {
  type: number;
  body: string;
  sender: string;
  receiver: string;
  sts: string;
};

export type Attachment = {
  id: string;
  messagesID: string;
  messages: string;
};

export type Conversation = {
  id: string;
  creatorID: string;
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
};

export type State = {
  messages: Message[];
  attachments: Attachment[];
  conversations: Conversation[];
  contacts: Contact[];
};

export type Action = {
  type: string;
  payload: State;
  userId?: number;
};

export type Children = {
  children: React.ReactNode;
};
