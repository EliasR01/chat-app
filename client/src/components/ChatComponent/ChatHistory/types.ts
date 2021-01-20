import { Dispatch, SetStateAction, MouseEvent } from "react";

export type props = {
  setOption: Dispatch<SetStateAction<string>>;
  option: string;
  setChat: Dispatch<SetStateAction<string>>;
  setConv: Dispatch<SetStateAction<string>>;
  conversations?: conversation[];
  contacts?: contact[];
  people?: User[];
  anchorEl: HTMLElement | null;
  setAnchorEl: (e: MouseEvent<HTMLButtonElement> | null) => void;
  handleClose: () => void;
  logout: () => void;
  openProfile: Dispatch<SetStateAction<boolean>>;
  search: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
};

export type conversation = {
  id: string;
  creator: string;
  member: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  sts: string;
};

export type contact = {
  id: string;
  name: string;
  email: string;
  userId: string;
  username: string;
  address: string;
  phone: string;
};

export type User = {
  id?: number;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  username?: string;
};
