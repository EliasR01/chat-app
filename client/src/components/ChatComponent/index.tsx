import React, { ReactElement } from "react";
import { Paper } from "@material-ui/core";
import Chat from "./Chat";
import ChatHistory from "./ChatHistory";
import ChatProfile from "./ChatProfile";
import { usePaperStyles } from "./styles";

const ChatComponent = (): ReactElement => {
  const paperStyles = usePaperStyles();

  return (
    <Paper className={paperStyles.root}>
      <ChatHistory />
      <Chat />
      <ChatProfile />
    </Paper>
  );
};

export default ChatComponent;
