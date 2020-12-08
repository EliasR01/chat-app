import React, { ReactElement } from "react";
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
} from "./styles";
import { IconsWrapper, OptionsWrapper } from "./styledComponents";

const ChatHistory = (): ReactElement => {
  const containerStyles = useContainerStyles();
  const boxStyles = useBoxStyles();
  const inputStyles = useInputSyles();
  const buttonStyles = useButtonStyles();

  return (
    <Container className={containerStyles.root}>
      <Box className={boxStyles.root}>
        <h2>HELLOCHAT</h2>
        <OptionsWrapper>
          <Button className={buttonStyles.root}>
            <AddCircle />
          </Button>
          <Button className={buttonStyles.root}>
            <MoreVert />
          </Button>
        </OptionsWrapper>
      </Box>
      <Box className={boxStyles.root}>
        <Input
          placeholder="Search here..."
          disableUnderline={true}
          className={inputStyles.root}
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
        />
      </Box>
      <Box className={boxStyles.root}>
        <IconsWrapper>
          <Button>
            <History />
          </Button>
          <Button>
            <People />
          </Button>
          <Button>
            <Contacts />
          </Button>
          <Button>
            <Archive />
          </Button>
        </IconsWrapper>
      </Box>
      <Box>
        <List>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Some Photo" />
            </ListItemAvatar>
            <ListItemText
              primary="Some Name"
              secondary="This is some text example"
            />
            <ListItemSecondaryAction>
              <Lens />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      </Box>
    </Container>
  );
};

export default ChatHistory;