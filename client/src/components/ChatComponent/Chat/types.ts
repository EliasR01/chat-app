import { Dispatch, SetStateAction } from "react";
import { Message } from "../../../websocket/types";

export type boxProps = {
  type: string;
};

export type props = {
  name: string | null | undefined;
  setMessage: Dispatch<SetStateAction<string>>;
  send: () => void;
  messages: Message[];
  message: string;
  chatRef: React.RefObject<HTMLDivElement>;
};
