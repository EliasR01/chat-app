import React, {
  createContext,
  ReactElement,
  useEffect,
  useReducer,
  useContext,
} from "react";
import { connect } from "../../websocket";
import { State, Children, Payload, Response } from "./types";
import { chatMiddleware } from "./chatMiddleware";
import { chatReducer } from "./chatReducer";
import { UserContext } from "../User/UserContext";

const initialState: State = {
  messages: {},
  attachments: [],
  conversations: {},
  contacts: [],
  people: [],
};

export const ChatContext = createContext<{
  state: State;
  dispatch: (action: string, payload: Payload) => Promise<Response>;
}>({
  state: initialState,
  dispatch: async () => {
    return { data: "Nothing executed", code: 0 };
  },
});

export const ChatProvider = ({ children }: Children): ReactElement => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { state: userState } = useContext(UserContext);
  //This is a hook that will handle all the dispatch operations needed for the ChatComponent functionality
  //including sending messages, receiving, querying and mutating messages, all kind of operations with the API.
  const useMiddleware = (action: string, data: Payload): Promise<Response> => {
    return chatMiddleware(action, data, dispatch);
  };

  //This function executed once this component is loaded,
  //connects the websocket to the server and listens all the messages that are sent by the server
  useEffect(() => {
    const messageHandler = (msg: MessageEvent): void => {
      const data = JSON.parse(msg.data);
      let key = "";
      for (const index in data) {
        key = index;
      }

      if (typeof data !== "string") {
        if (data[key] && data[key].type === 1) {
          const payloadState: State = {
            messages: data,
            conversations: state.conversations,
          };
          dispatch({ type: "RECEIVE", payload: payloadState });
        }
      }
    };
    connect({ messageHandler: messageHandler, username: userState.username });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChatContext.Provider value={{ state, dispatch: useMiddleware }}>
      {children}
    </ChatContext.Provider>
  );
};
