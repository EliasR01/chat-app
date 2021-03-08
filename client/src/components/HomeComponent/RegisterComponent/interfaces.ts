import { Dispatch, SetStateAction } from "react";

export interface ModalComponentProps {
  open: boolean;
  handleModal: Dispatch<SetStateAction<boolean>>;
  login: (email: string, password: string) => void;
}
