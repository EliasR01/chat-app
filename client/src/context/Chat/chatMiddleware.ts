import { Dispatch } from "react";
import axios from "axios";
import { Action, State } from "./types";

export const chatMiddleware = async (
  action: string,
  payload: State,
  dispatch: Dispatch<Action>
): Promise<boolean> => {
  switch (action) {
    case "LOGIN": {
      //Fetch the chat information: [messages, conversations, contacts, all the people registered in the application]
      let result = false;
      await axios
        .get(`http://localhost:4000/user?user=${payload.username}`, {
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
    case "SEND": {
      //Sends the message
      dispatch({ payload: payload, type: "SEND" });
      return true;
    }
    case "RECEIVE": {
      //Receive the message
      dispatch({ payload: payload, type: "RECEIVE" });
      return true;
    }
    default:
      return false;
  }
};
