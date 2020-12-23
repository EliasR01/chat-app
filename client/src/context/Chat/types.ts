export type Message = {
  type?: number;
  body: string;
  sender?: string;
  receiver?: string;
  sts?: string;
};

export type Action = {
  type: string;
  payload: Message;
};

export type Children = {
  children: React.ReactNode;
};
