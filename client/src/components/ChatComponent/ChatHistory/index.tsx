import { ReactElement, useContext, useState } from "react";
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
import {
  IconsWrapper,
  OptionsWrapper,
  ConvWrapper,
  Text,
} from "./styledComponents";
import { chatModalProps, props } from "./types";
import { UserContext } from "../../../context/User/UserContext";
import ChatModal from "./ChatModal";

const ChatHistory = ({
  setOption,
  option,
  setChat,
  setConv,
  conversations,
  people,
  contacts,
  anchorEl,
  anchorOptions,
  handleClose,
  logout,
  openProfile,
  search,
  menuOption,
  addContact,
  removeContact,
  createConv,
}: props): ReactElement => {
  const containerStyles = useContainerStyles();
  const boxStyles = useBoxStyles();
  const inputStyles = useInputSyles();
  const buttonStyles = useButtonStyles();
  const iconStyles = useIconStyles();
  const { state: userState } = useContext(UserContext);
  const [modalProps, setModalProps] = useState<chatModalProps>({
    type: "",
    open: false,
    handleClose: () => null,
    action: () => null,
    action2: () => null,
  });
  let jsx;
  //This renders a list based on the option that is selected
  switch (option) {
    case "history" || "archived":
      jsx =
        conversations && conversations.length > 0
          ? conversations.map((conv) => {
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
                  <ListItem alignItems="flex-start" key={conv.id}>
                    <ListItemAvatar key={conv.createdAt}>
                      <Avatar alt="Some Photo" key={conv.id} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user}
                      secondary={conv.lastMessage}
                      key={conv.id}
                    />
                    <ListItemSecondaryAction key={conv.updatedAt}>
                      <Lens key={conv.id} />
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
          ? people.map((person, index) => {
              const personId = person.id;
              // const currPerson = person;

              return (
                <ConvWrapper key={personId}>
                  <ListItem
                    alignItems="flex-start"
                    onClick={(e) => {
                      setModalProps({
                        type: "people",
                        element: e.currentTarget,
                        open: true,
                        handleClose: () => setModalProps({ ...modalProps }),
                        action: () => addContact(person),
                        action2: () => null,
                      });
                    }}
                    key={personId}
                  >
                    <ListItemAvatar key={personId}>
                      <Avatar alt="Some Photo" key={personId} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={person.name}
                      secondary={person.username}
                      key={person.email}
                    />
                    <ListItemSecondaryAction key={person.phone}>
                      <Lens key={personId} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" key={person.email} />
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
                  <ListItem
                    alignItems="flex-start"
                    onClick={(e) => {
                      console.log("Clicked!");
                      setModalProps({
                        type: "contacts",
                        element: e.currentTarget,
                        open: true,
                        handleClose: () => setModalProps({ ...modalProps }),
                        action: () => createConv(contact.username),
                        action2: () => removeContact(contact),
                      });
                    }}
                    key={contact.id}
                  >
                    <ListItemAvatar key={contact.id}>
                      <Avatar alt="Some Photo" key={contact.id} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={contact.name}
                      secondary={contact.username}
                      key={contact.username}
                    />
                    <ListItemSecondaryAction key={contact.name}>
                      <Lens key={contact.id} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" key={contact.name} />
                </ConvWrapper>
              );
            })
          : null;
      break;
  }

  return (
    <Container className={containerStyles.root}>
      <ChatModal {...modalProps} />
      <Box className={boxStyles.root}>
        <Typography component="h5" variant="h5">
          HELLOCHAT
        </Typography>
        <OptionsWrapper>
          <Button
            className={buttonStyles.root}
            onClick={() => setOption("contacts")}
          >
            <AddCircle />
          </Button>
          <Button
            aria-controls="simple-menu"
            onClick={(e) => anchorOptions(e.currentTarget, "profile")}
            className={buttonStyles.root}
          >
            <MoreVert />
          </Button>
          <Menu
            id="simple-menu"
            keepMounted
            anchorEl={anchorEl}
            open={menuOption === "profile"}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                anchorOptions(null, "");
                openProfile(true);
              }}
            >
              Edit Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                anchorOptions(null, "");
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
        <Text>{option.toUpperCase()}</Text>
        <List>{jsx}</List>
      </Box>
    </Container>
  );
};

export default ChatHistory;
