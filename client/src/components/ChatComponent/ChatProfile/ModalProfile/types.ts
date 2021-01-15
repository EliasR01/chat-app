import { Dispatch, SetStateAction } from "react";

export type props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
