import { ReactNode } from "react";

export type User = {
  name?: string;
  email: string;
  password?: string;
};

export type Action = {
  type: string;
  payload: User;
};

export type Children = {
  children: ReactNode;
};
