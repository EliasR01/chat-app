import { Dispatch } from "react";
import axios from "axios";
import { Action, State } from "./types";

export const chatMiddleware = async (
  action: string,
  payload: number | State,
  dispatch: Dispatch<Action>
): Promise<boolean> => {
  switch (action) {
    case "LOGIN": {
      let result = false;
      await axios
        .get(`http://localhost:4000/auth?user=${payload}`, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: "LOGIN" });
            result = true;
          } else {
            result = false;
          }
        });
      return result;
    }
    default:
      return false;
  }
};
