import { Dispatch, SetStateAction } from "react";

export type props = {
  setOption: Dispatch<SetStateAction<string>>;
  option: string;
};
