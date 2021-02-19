type Message = {
  type?: number;
  body: string;
  sender?: string;
  receiver?: string;
};

export type MessageMap = {
  [ID: string]: Message;
};
