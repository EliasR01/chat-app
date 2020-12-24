import React, {
  createContext,
  ReactElement,
  useEffect,
  useReducer,
} from "react";
import { connect } from "../../websocket";
import { State, Children, Action } from "./types";
import { chatMiddleware } from "./chatMiddleware";
import { chatReducer } from "./chatReducer";

const initialState: State = {
  messages: null,
  attachments: null,
  conversations: null,
  contacts: null,
};

export const ChatContext = createContext<{
  state: State;
  dispatch: (
    action: string,
    payload: number | State,
    dispatch: React.Dispatch<Action>
  ) => Promise<boolean>;
}>({
  state: initialState,
  dispatch: async () => false,
});

export const ChatProvider = ({ children }: Children): ReactElement => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const useMiddleware = (
    action: string,
    data: number | State
  ): Promise<boolean> => {
    return chatMiddleware(action, data, dispatch);
  };

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

  return (
    <ChatContext.Provider value={{ state, dispatch: useMiddleware }}>
      {children}
    </ChatContext.Provider>
  );
};
