import { EmojiData } from "emoji-mart";
import { Dispatch, SetStateAction } from "react";

export type boxProps = {
  type: string;
};

export type itemProps = {
  primary: boolean;
};

export type props = {
  name: string | null | undefined;
  username: string | null | undefined;
  setMessage: Dispatch<SetStateAction<string>>;
  send: () => void;
  messages: Message[];
  message: string;
  chatRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  addEmoji: (e: EmojiData) => void;
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
