import React, { ReactElement, useEffect, useState } from "react";
import { connect } from "../../websocket";
import ChatComponent from "../../components/ChatComponent";

const ChatContainer = (): ReactElement => {
  const [messages, setMessages] = useState<Array<string>>([]);

  useEffect(() => {
    const messageHandler = (msg: MessageEvent): void => {
      console.log("New message!");
      console.log(msg.data);
      setMessages([...messages, msg.data]);
      console.log(messages);
    };
    const functions = {
      messageHandler,
    };
    connect(functions);
  }, [messages]);

  return <ChatComponent />;
};

export default ChatContainer;
