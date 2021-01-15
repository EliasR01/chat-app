import React, { ReactElement } from "react";
import {
  Box,
  Button,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import {
  useBoxStyles,
  useAvatarStyles,
  useTypographyStyles,
  useListStyles,
} from "./styles";
import {
  ExitWrapper,
  UserWrapper,
  InfoWrapper,
  MediaWrapper,
  Media,
  Wrapper,
} from "./styledComponents";
import {
  Clear,
  LocationSearching,
  PhoneAndroid,
  Email,
  MoreVert,
} from "@material-ui/icons";
import { props } from "./types";

const ChatProfile = ({ user, showProfile, toggle }: props): ReactElement => {
  const boxStyles = useBoxStyles({ hidden: !showProfile });
  const avatarStyles = useAvatarStyles();
  const typographyStyles = useTypographyStyles();
  const listStyles = useListStyles();
  return (
    <Box className={boxStyles.root}>
      <ExitWrapper>
        {showProfile ? (
          <Button onClick={() => toggle(!showProfile)}>
            <Clear />
          </Button>
        ) : (
          <Button onClick={() => toggle(!showProfile)} disabled={!user}>
            <MoreVert />
          </Button>
        )}
      </ExitWrapper>
      <Wrapper hidden={!showProfile}>
        <UserWrapper>
          <Avatar className={avatarStyles.large} />
          <Typography className={typographyStyles.name}>
            {user?.name}
          </Typography>
          <Typography className={typographyStyles.description}>
            Job description
          </Typography>
          <Typography className={typographyStyles.description}>
            {user?.username}
          </Typography>
        </UserWrapper>
        <InfoWrapper>
          <List>
            <ListItem className={listStyles.root}>
              <ListItemAvatar>
                <LocationSearching />
              </ListItemAvatar>
              <ListItemText primary={user?.address} />
            </ListItem>
            <ListItem className={listStyles.root}>
              <ListItemAvatar>
                <PhoneAndroid />
              </ListItemAvatar>
              <ListItemText primary={user?.phone} />
            </ListItem>
            <ListItem className={listStyles.root}>
              <ListItemAvatar>
                <Email />
              </ListItemAvatar>
              <ListItemText primary={user?.email} />
            </ListItem>
          </List>
        </InfoWrapper>
        <MediaWrapper>
          <Typography>Media</Typography>
          <Media>
            <Avatar />
            <Avatar />
            <Avatar />
            <Avatar />
          </Media>
        </MediaWrapper>
      </Wrapper>
    </Box>
  );
};

export default ChatProfile;
