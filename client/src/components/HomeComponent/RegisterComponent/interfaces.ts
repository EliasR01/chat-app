import { Dispatch, SetStateAction } from "react";

export interface ModalComponentProps {
  open: boolean;
  handleModal: Dispatch<SetStateAction<boolean>>;
}
