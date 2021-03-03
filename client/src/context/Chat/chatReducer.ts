import { State, Action } from "./types";
import { sendMsg } from "../../websocket";

export const chatReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SEND": {
      const data = action.payload;
      const message = data.messages;
      sendMsg(message);
      return state;
    }
    case "RECEIVE": {
      const data = action.payload;
      const message = data.messages;
      let ID = "";

      for (const index in message) {
        ID = index;
      }
      const receivedMessage = message[ID];

      state.messages[ID] = receivedMessage;
      console.log(state);
      return state;
    }
    case "LOGIN": {
      const data = action.payload;
      return { ...state, ...data };
    }
    case "ADD_CONTACT": {
      const data = action.payload;
      return { ...state, contacts: data.contacts };
    }
    case "REMOVE_CONTACT": {
      const data = action.payload;
      return { ...state, contacts: data.contacts };
    }
    case "CREATE_CONV": {
      const data = action.payload;
      let convId = "";
      for (const index in data.conversations) {
        convId = index;
      }

      const newConv = data.conversations[convId];

      state.conversations[convId] = newConv;
      return state;
    }
    default:
      return state;
  }
};
