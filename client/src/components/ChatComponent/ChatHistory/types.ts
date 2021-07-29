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
  id?: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  username?: string;
};

export type chatModalProps = {
  type: string;
  element?: Element;
  open: boolean;
  handleClose: () => void;
  action: () => void;
  action2: () => void;
  // closeAction: (arg1: null, arg2: string) => void;
};

export type modalOptions = {
  title: string;
  action: () => void;
};

export type modalMap = {
  [type: string]: modalOptions[];
};

//createConv(contact.username);
//removeContact(contact);
