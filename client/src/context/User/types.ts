import { ReactNode } from "react";

export type User = {
  ID?: number;
  name: string;
  email: string;
  password?: string;
  address?: string;
  phone?: string;
  username?: string;
};

export type Action = {
  type: string;
  payload: User;
};

export type Children = {
  children: ReactNode;
};
