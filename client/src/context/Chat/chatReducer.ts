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
      let ID = "";

      for (const index in data.messages) {
        ID = index;
      }

      const receivedMessage = data.messages[ID];
      const convId = receivedMessage.conversationId!;

      state.conversations[convId].lastMessage = {
        String: ID,
        Valid: true,
      };

      return {
        ...state,
        messages: { ...state.messages, [ID]: receivedMessage },
      };
    }
    case "CREATE_CONV": {
      const data = action.payload;
      let convId = "";

      for (const index in data.conversations) {
        convId = index;
      }

      const newConv = data.conversations[convId];
      return {
        ...state,
        conversations: { ...state.conversations, [convId]: newConv },
      };
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
    default:
      return state;
  }
};
