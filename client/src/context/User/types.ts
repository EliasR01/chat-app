import { ReactNode } from "react";

export type User = {
  id?: string;
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

export type UserPayload = {
  data: FormData;
  email?: string;
  password?: string;
};
