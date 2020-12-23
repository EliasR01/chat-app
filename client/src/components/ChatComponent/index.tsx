import React, {
  ReactElement,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Paper } from "@material-ui/core";
import Chat from "./Chat";
import ChatHistory from "./ChatHistory";
import ChatProfile from "./ChatProfile";
import { usePaperStyles } from "./styles";
import { UserContext } from "../../context/User/UserContext";
import { ChatContext } from "../../context/Chat/ChatContext";

const ChatComponent = (): ReactElement => {
  const paperStyles = usePaperStyles();
  const [message, setMessage] = useState<string>("");
  const [option, setOption] = useState<string>("history");
  const { state: userState } = useContext(UserContext);
  const { state: chatState, dispatch } = useContext(ChatContext);
  const chatRef = useRef<HTMLDivElement>();

  useEffect(() => {
    chatRef.current?.scrollTo({
      behavior: "smooth",
      top: chatRef.current?.scrollHeight,
    });
  }, [chatState]);

  const send = () => {
    const socketMessage = {
      type: 1,
      body: message,
      sender: userState.name,
      sts: "SENT",
    };
    dispatch({ type: "SEND", payload: socketMessage });
    setMessage("");
  };

  return (
    <Paper className={paperStyles.root}>
      <ChatHistory setOption={setOption} option={option} />
      <Chat
        name={userState.name}
        setMessage={setMessage}
        send={send}
        messages={chatState}
        message={message}
        chatRef={chatRef}
      />
      <ChatProfile user={userState} />
    </Paper>
  );
};

export default ChatComponent;
