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
      // if (state.find(value => value.sender === data.sender)) {
      //   return state.map(value => {
      //     value.sender === data.sender ? return {
      //       body: value.body,
      //     }
      //   })
      // }
      return {
        ...state,
        ...data,
      };
    }
    case "LOGIN": {
      const data = action.payload;
      return { ...state, ...data };
    }
    default:
      return state;
  }
};
