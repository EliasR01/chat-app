import React, { ReactElement, ReactNode } from "react";
import {
  Container,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Input,
  Button,
} from "@material-ui/core";
import {
  Send,
  EmojiEmotions,
  Attachment,
  AddIcCall,
  VideoCall,
  FiberManualRecord,
} from "@material-ui/icons";
import {
  useContainerStyles,
  useBoxStyles,
  useListStyles,
  useListItemStyles,
  useInputStyles,
  useButtonStyles,
} from "./styles";
import {
  HeaderWrapper,
  ItemsWrapper,
  ChatActions,
  InputWrapper,
  Form,
  ChatWrapper,
} from "./styledComponents";
import { props } from "./types";
import { Message } from "../../../websocket/types";

const Chat = ({
  name,
  send,
  setMessage,
  messages,
  message,
  chatRef,
}: props): ReactElement => {
  const containerStyles = useContainerStyles();
  const headerBoxStyles = useBoxStyles({ type: "h" });
  const bodyBoxStyles = useBoxStyles({ type: "b" });
  const chatBoxStyles = useBoxStyles({ type: "c" });
  const listStyles = useListStyles();
  const listItemStyles = useListItemStyles();
  const inputStyles = useInputStyles();
  const buttonStyles = useButtonStyles();

  return (
    <Container className={containerStyles.root}>
      <Box className={headerBoxStyles.root}>
        <HeaderWrapper>
          <ItemsWrapper>
            <FiberManualRecord />
            <h2>{name}</h2>
          </ItemsWrapper>
          <ItemsWrapper>
            <Button>
              <AddIcCall classes={{ root: buttonStyles.root }} />
            </Button>
            <Button>
              <VideoCall classes={{ root: buttonStyles.root }} />
            </Button>
          </ItemsWrapper>
        </HeaderWrapper>
      </Box>
      <Box className={bodyBoxStyles.root}>
        <List className={listStyles.root}>
          <ChatWrapper ref={chatRef}>
            {messages.map(
              (message: Message): ReactNode => {
                if (message.type === 1) {
                  return (
                    <ListItem className={listItemStyles.root}>
                      <ListItemAvatar>
                        <Avatar />
                      </ListItemAvatar>
                      <ListItemText secondary={message.body} />
                    </ListItem>
                  );
                }
              }
            )}
          </ChatWrapper>
        </List>
      </Box>
      <Box className={chatBoxStyles.root}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (message.length > 0) {
              send();
            }
          }}
        >
          <InputWrapper>
            <Input
              className={inputStyles.root}
              value={message}
              placeholder="Type your message here"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </InputWrapper>
          <ChatActions>
            <Button>
              <EmojiEmotions />
            </Button>
            <Button>
              <Attachment />
            </Button>
            <Button type="submit" classes={{ root: buttonStyles.root }}>
              <Send />
            </Button>
          </ChatActions>
        </Form>
      </Box>
    </Container>
  );
};

export default Chat;
