import React, { ReactElement } from "react";
import { Box } from "@material-ui/core";
import { useBoxStyles } from "./styles";

const ChatProfile = (): ReactElement => {
  const boxStyles = useBoxStyles();

  return (
    <Box className={boxStyles.root}>
      <div>ChatProfile works!</div>
    </Box>
  );
};

export default ChatProfile;
