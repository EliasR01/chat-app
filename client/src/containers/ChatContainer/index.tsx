import React, { ReactElement } from "react";
import ChatComponent from "../../components/ChatComponent";
import { ChatProvider } from "../../context/Chat/ChatContext";
// import axios from "axios";

const ChatContainer = (): ReactElement => {
  // const cookie = document.cookie.split("=")[1];

  return (
    <ChatProvider>
      <ChatComponent />
    </ChatProvider>
  );
};

export default ChatContainer;
