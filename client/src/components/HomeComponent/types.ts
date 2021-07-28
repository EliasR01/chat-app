import { Dispatch, SetStateAction } from "react";

type LoginData = {
  name: string;
  email: string;
  password: string;
};

export type Props = {
  data: LoginData;
  setData: Dispatch<SetStateAction<LoginData>>;
  login: (email: string, password: string) => void;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  error: string | boolean;
  loading: boolean;
};
