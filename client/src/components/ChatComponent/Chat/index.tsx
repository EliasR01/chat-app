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
  Typography,
} from "@material-ui/core";
import {
  Send,
  Attachment,
  AddIcCall,
  VideoCall,
  FiberManualRecord,
  EmojiEmotions,
} from "@material-ui/icons";
import {
  useContainerStyles,
  useBoxStyles,
  useListStyles,
  useListItemStyles,
  useInputStyles,
  useButtonStyles,
  useListItemTextStyles,
  useListItemAvatarStyles,
} from "./styles";
import {
  HeaderWrapper,
  ItemsWrapper,
  ChatActions,
  InputWrapper,
  Form,
  ChatWrapper,
  EmojiDialog,
} from "./styledComponents";
import { props, Message } from "./types";
import { Picker } from "emoji-mart";
import "./emoji-mart.css";

const Chat = ({
  name,
  send,
  setMessage,
  messages,
  message,
  chatRef,
  username,
  inputRef,
  addEmoji,
  picker,
  showPicker,
}: props): ReactElement => {
  const containerStyles = useContainerStyles();
  const headerBoxStyles = useBoxStyles({ type: "h" });
  const bodyBoxStyles = useBoxStyles({ type: "b" });
  const chatBoxStyles = useBoxStyles({ type: "c" });
  const listStyles = useListStyles();
  const primaryListItemStyles = useListItemStyles({ primary: true });
  const secondaryListItemStyles = useListItemStyles({ primary: false });
  const inputStyles = useInputStyles();
  const buttonStyles = useButtonStyles();
  const primaryListItemTextStyles = useListItemTextStyles({ primary: true });
  const secondaryListItemTextStyles = useListItemTextStyles({ primary: false });
  const listItemAvatarStyles = useListItemAvatarStyles();

  const isSelectedChat = name ? true : false;
  return (
    <Container className={containerStyles.root}>
      <Box className={headerBoxStyles.root}>
        <HeaderWrapper>
          <ItemsWrapper>
            <FiberManualRecord />
            <Typography component="h5" variant="h5">
              {name}
            </Typography>
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
        <ChatWrapper ref={chatRef}>
          <List className={listStyles.root}>
            {messages && messages.length > 0
              ? messages.map(
                  (message: Message): ReactNode => {
                    const isPrimary = message.sender !== username;
                    if (message.type === 1) {
                      const messageJsx = isPrimary ? (
                        <ListItem
                          className={primaryListItemStyles.root}
                          key={message.id}
                        >
                          <ListItemText
                            secondary={message.body}
                            className={primaryListItemTextStyles.root}
                          />
                          <ListItemAvatar className={listItemAvatarStyles.root}>
                            <Avatar />
                          </ListItemAvatar>
                        </ListItem>
                      ) : (
                        <ListItem
                          className={secondaryListItemStyles.root}
                          key={message.id}
                        >
                          <ListItemAvatar className={listItemAvatarStyles.root}>
                            <Avatar />
                          </ListItemAvatar>
                          <ListItemText
                            secondary={message.body}
                            className={secondaryListItemTextStyles.root}
                          />
                        </ListItem>
                      );

                      return messageJsx;
                    } else {
                      return null;
                    }
                  }
                )
              : null}
          </List>
        </ChatWrapper>
      </Box>
      {picker ? (
        <EmojiDialog>
          <Picker
            onSelect={(e) => addEmoji(e)}
            title="Pick your emoji…"
            emoji="point_up"
            native={true}
          />
        </EmojiDialog>
      ) : null}
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
              placeholder={
                !isSelectedChat
                  ? "Select a chat to start messaging"
                  : "Type your message here"
              }
              readOnly={!isSelectedChat}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </InputWrapper>
          <ChatActions>
            <Button disabled={!isSelectedChat}>
              <EmojiEmotions onClick={() => showPicker(!picker)} />
            </Button>
            <input type="file" ref={inputRef} style={{ display: "none" }} />
            <Button
              onClick={() => inputRef.current?.click()}
              disabled={!isSelectedChat}
            >
              <Attachment />
            </Button>
            <Button
              type="submit"
              classes={{ root: buttonStyles.root }}
              disabled={!isSelectedChat}
            >
              <Send />
            </Button>
          </ChatActions>
        </Form>
      </Box>
    </Container>
  );
};

export default Chat;
