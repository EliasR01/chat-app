import { Message, Action } from "./types";
import { sendMsg } from "../../websocket";

export const chatReducer = (state: Message[], action: Action): Message[] => {
  switch (action.type) {
    case "SEND": {
      const data = action.payload;
      sendMsg(data);
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
      return [...state, data];
    }
    default:
      return state;
  }
};
