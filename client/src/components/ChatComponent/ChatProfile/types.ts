import { Dispatch, SetStateAction } from "react";

export type props = {
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
    username: string;
  } | null;
  toggle: Dispatch<SetStateAction<boolean>>;
  showProfile: boolean;
};

export type boxProps = {
  hidden: boolean;
};
