import React, { ReactElement } from "react";
import { Container, Box } from "@material-ui/core";
import { useContainerStyles, useBoxStyles } from "./styles";
import { HeaderWrapper, ItemsWrapper  } from "./styledComponents";

const Chat = (): ReactElement => {
  const containerStyles = useContainerStyles();
  const headerBoxStyles = useBoxStyles({ type: "h" });
  const bodyBoxStyles = useBoxStyles({ type: "b" });
  return (
    <Container className={containerStyles.root}>
      <Box className={headerBoxStyles.root}>
        <HeaderWrapper>
        <ItemsWrapper>
          <div>dot</div>
          <div>Some name</div>
        </ItemsWrapper>
        <ItemsWrapper>
          <div>some logo</div>
          <div>some logo</div>
         </ItemsWrapper>
        </HeaderWrapper>
        </Box>
        <Box className={bodyBoxStyles.root}>
          <div>This is the body!</div> 
        </Box>
    </Container>
  );
};

export default Chat;
