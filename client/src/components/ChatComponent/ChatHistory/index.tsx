import React, { ReactElement, useContext } from "react";
import {
  Box,
  Container,
  Input,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import {
  Search,
  History,
  Archive,
  Contacts,
  People,
  AddCircle,
  MoreVert,
  Lens,
} from "@material-ui/icons";
import {
  useContainerStyles,
  useBoxStyles,
  useInputSyles,
  useButtonStyles,
  useIconStyles,
} from "./styles";
import { IconsWrapper, OptionsWrapper, ConvWrapper } from "./styledComponents";
import { props } from "./types";
import { ChatContext } from "../../../context/Chat/ChatContext";
import { UserContext } from "../../../context/User/UserContext";

const ChatHistory = ({
  setOption,
  option,
  setChat,
  setConv,
  conversations,
  people,
  contacts,
  anchorEl,
  setAnchorEl,
  handleClose,
  logout,
  openProfile,
  search,
}: props): ReactElement => {
  const containerStyles = useContainerStyles();
  const boxStyles = useBoxStyles();
  const inputStyles = useInputSyles();
  const buttonStyles = useButtonStyles();
  const iconStyles = useIconStyles();
  const { state: chatState } = useContext(ChatContext);
  const { state: userState } = useContext(UserContext);
  let jsx;
  console.info("Chat state: ", people);
  //This renders a list based on the option that is selected
  switch (option) {
    case "history" || "archived":
      jsx =
        conversations && conversations.length > 0
          ? conversations.map((conv) => {
              //Filtered messages by conversations
              const filteredMessage =
                chatState.messages &&
                chatState.messages.filter((m) => m.conversationId === conv.id);
              //Last message that will be shown in the Chat Icon at the ChatHistory
              const lastMessage =
                filteredMessage && filteredMessage[filteredMessage.length - 1];
              //User variable, will be the username that'll be shown next to the Chat Avatar at the ChatHistory.
              const user =
                conv.creator === userState.username
                  ? conv.member
                  : conv.creator;
              //Username variable, selects the contact username in order to put the user name in the Chat component
              const username =
                conv.creator === userState.username
                  ? conv.member
                  : conv.creator;
              return (
                <ConvWrapper
                  key={conv.id}
                  onClick={() => {
                    setChat(username);
                    setConv(conv.id);
                  }}
                >
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Some Photo" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user}
                      secondary={lastMessage && lastMessage.body}
                    />
                    <ListItemSecondaryAction>
                      <Lens />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </ConvWrapper>
              );
            })
          : null;
      break;
    case "people":
      jsx =
        people && people.length > 0
          ? people.map((person) => {
              return (
                <ConvWrapper key={person.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Some Photo" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={person.name}
                      secondary={person.username}
                    />
                    <ListItemSecondaryAction>
                      <Lens />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </ConvWrapper>
              );
            })
          : null;
      break;
    case "contacts":
      jsx =
        contacts && contacts.length > 0
          ? contacts.map((contact) => {
              return (
                <ConvWrapper key={contact.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Some Photo" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={contact.name}
                      secondary={contact.username}
                    />
                    <ListItemSecondaryAction>
                      <Lens />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </ConvWrapper>
              );
            })
          : null;
      break;
  }

  return (
    <Container className={containerStyles.root}>
      <Box className={boxStyles.root}>
        <Typography component="h5" variant="h5">
          HELLOCHAT
        </Typography>
        <OptionsWrapper>
          <Button className={buttonStyles.root}>
            <AddCircle />
          </Button>
          <Button aria-controls="simple-menu" onClick={(e) => setAnchorEl(e)}>
            <MoreVert />
          </Button>
          <Menu
            id="simple-menu"
            keepMounted
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                openProfile(true);
              }}
            >
              Edit Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                logout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </OptionsWrapper>
      </Box>
      <Box className={boxStyles.root}>
        <Input
          placeholder="Search here..."
          disableUnderline={true}
          className={inputStyles.root}
          onChange={(e) => search(e)}
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
        />
      </Box>
      <Box className={boxStyles.root}>
        <IconsWrapper>
          <Button
            className={
              option === "history" ? iconStyles.selected : iconStyles.hover
            }
            onClick={() => setOption("history")}
          >
            <History />
          </Button>
          <Button
            className={
              option === "people" ? iconStyles.selected : iconStyles.hover
            }
            onClick={() => setOption("people")}
          >
            <People />
          </Button>
          <Button
            className={
              option === "contacts" ? iconStyles.selected : iconStyles.hover
            }
            onClick={() => setOption("contacts")}
          >
            <Contacts />
          </Button>
          <Button
            className={
              option === "archived" ? iconStyles.selected : iconStyles.hover
            }
            onClick={() => setOption("archived")}
          >
            <Archive />
          </Button>
        </IconsWrapper>
      </Box>
      <Box>
        <List>{jsx}</List>
      </Box>
    </Container>
  );
};

export default ChatHistory;
