import React, {
  createContext,
  Dispatch,
  ReactElement,
  useEffect,
  useReducer,
} from "react";
import { connect } from "../../websocket";
import { Message, Children } from "./types";
import { chatReducer } from "./chatReducer";
import { Action } from "./types";

const initialState: Array<Message> = [
  {
    body: "Message",
    type: 0,
    sender: "Anybody",
  },
];

export const ChatContext = createContext<{
  state: Message[];
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const ChatProvider = ({ children }: Children): ReactElement => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  useEffect(() => {
    const messageHandler = (msg: MessageEvent): void => {
      const data = JSON.parse(msg.data);
      const messageData = JSON.parse(data.body);
      if (messageData.type === 1) {
        dispatch({ type: "RECEIVE", payload: messageData });
      }
    };
    const functions = {
      messageHandler,
    };
    connect(functions);
  }, []);

  //   const sendMessage = (msg: string): void => {
  //     const message: Message = {
  //       body: msg,
  //       sender: state.name,
  //     };
  //     sendMsg(message);
  //   };

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
