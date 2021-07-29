import { Dispatch, SetStateAction } from "react";
import { Contact } from "../types";

export type props = {
  setOption: Dispatch<SetStateAction<string>>;
  option: string;
  setChat: Dispatch<SetStateAction<string>>;
  setConv: Dispatch<SetStateAction<string>>;
  conversations?: conversation[];
  contacts?: contact[];
  people?: User[];
  anchorEl: Element | null | undefined;
  handleClose: () => void;
  logout: () => void;
  openProfile: Dispatch<SetStateAction<boolean>>;
  search: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  anchorOptions: (
    e: HTMLLIElement | HTMLButtonElement | null,
    option: string
  ) => void;
  menuOption: string;
  addContact: (person: User) => void;
  removeContact: (contact: Contact) => void;
  createConv: (contactUsername: string) => void;
};

export type conversation = {
  id: string;
  creator: string;
  member: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  sts: string;
  lastMessage: string;
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
