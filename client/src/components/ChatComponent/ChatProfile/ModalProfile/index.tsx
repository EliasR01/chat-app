import React, { ReactElement, useContext, useState } from "react";
import {
  Modal,
  Box,
  Paper,
  List,
  ListItemAvatar,
  ListItemText,
  ListItem,
  Avatar,
  Button,
  Typography,
  TextField,
  Backdrop,
  Fade,
} from "@material-ui/core";
import { props } from "./types";
import {
  useBoxStyles,
  useModalStyles,
  usePaperStyles,
  useTextFieldStyles,
} from "./styles";
import { Wrapper, InformationForm, ButtonWrapper } from "./styledComponents";
import { UserContext } from "../../../../context/User/UserContext";

const ModalProfile = ({ open, setOpen, setResponse }: props): ReactElement => {
  const boxStyles = useBoxStyles();
  const modalStyles = useModalStyles();
  const paperStyles = usePaperStyles();
  const textFieldStyles = useTextFieldStyles();
  const { state, dispatch } = useContext(UserContext);
  const [userData, setUserData] = useState(state);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const submitInformation = (): void => {
    setError(null);
    if (
      state.email === userData.email &&
      state.name === userData.name &&
      state.address === userData.address &&
      state.phone === userData.phone &&
      state.username === userData.username
    ) {
      setError("You must change at least one value!");
    } else {
      if (password != confirmPassword) {
        setError("Confirm password does not match");
      } else {
        const data = {
          ...userData,
          currUsername: state.username,
          password: password,
        };
        dispatch("UPDATE", data)
          .then((response) => {
            setResponse(response);
            setOpen(false);
          })
          .catch((err) => {
            setResponse(err);
            setOpen(false);
          });
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      className={modalStyles.root}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 250,
      }}
    >
      <Fade in={open}>
        <Box className={boxStyles.root}>
          <Paper elevation={2} className={paperStyles.root}>
            <Wrapper>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Change your profile photo"
                    secondary="Profile-pic.jpg"
                  />
                </ListItem>
              </List>
              <Button>Change</Button>
            </Wrapper>
          </Paper>
          <br />
          <Paper elevation={2} className={paperStyles.root}>
            <Typography component="h5" variant="h5">
              Change your information here
            </Typography>
            <InformationForm
              onSubmit={(e) => {
                e.preventDefault();
                submitInformation();
              }}
            >
              <Wrapper>
                <TextField
                  className={textFieldStyles.root}
                  required
                  label="Full Name"
                  defaultValue={userData.name}
                  variant="filled"
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                />
                <TextField
                  className={textFieldStyles.root}
                  required
                  label="Email Address"
                  defaultValue={userData.email}
                  variant="filled"
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              </Wrapper>
              <Wrapper>
                <TextField
                  className={textFieldStyles.root}
                  required
                  label="Address"
                  defaultValue={userData.address}
                  variant="filled"
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                />
              </Wrapper>
              <Wrapper>
                <TextField
                  className={textFieldStyles.root}
                  required
                  label="Phone Number"
                  defaultValue={userData.phone}
                  variant="filled"
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                />
                <TextField
                  className={textFieldStyles.root}
                  required
                  label="Username"
                  defaultValue={userData.username}
                  variant="filled"
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                />
              </Wrapper>
              <Wrapper>
                <TextField
                  className={textFieldStyles.root}
                  required
                  label="Password"
                  defaultValue={password}
                  variant="filled"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
                <TextField
                  className={textFieldStyles.root}
                  required
                  label="Confirm Password"
                  defaultValue={confirmPassword}
                  variant="filled"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                />
              </Wrapper>
              <br />
              <Wrapper>
                <ButtonWrapper>
                  {error ? (
                    <Typography color="error">{error}</Typography>
                  ) : null}
                  <Button type="submit">Submit Changes</Button>
                </ButtonWrapper>
              </Wrapper>
            </InformationForm>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalProfile;
