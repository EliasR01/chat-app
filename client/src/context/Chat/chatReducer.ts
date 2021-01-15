import { State, Action } from "./types";
import { sendMsg } from "../../websocket";

export const chatReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SEND": {
      const data = action.payload;
      const message = data.messages[0];
      sendMsg(message);
      return state;
    }
    case "RECEIVE": {
      const data = action.payload;
      const message = data.messages;
      console.log(message);
      console.log(state);
      return {
        ...state,
        messages: [...state.messages, message[0]],
      };
    }
    case "LOGIN": {
      const data = action.payload;
      if (data.messages === null) {
        data.messages = [];
      }
      return { ...state, ...data };
    }
    default:
      return state;
  }
};
