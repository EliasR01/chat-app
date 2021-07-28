import { Dispatch, SetStateAction } from "react";

export type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setResponse: Dispatch<SetStateAction<string | boolean>>;
};

export type PaperProps = {
  form: boolean;
};
