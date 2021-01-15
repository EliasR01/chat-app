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

const ModalProfile = ({ open, setOpen }: props): ReactElement => {
  const boxStyles = useBoxStyles();
  const modalStyles = useModalStyles();
  const paperStyles = usePaperStyles();
  const textFieldStyles = useTextFieldStyles();
  const { state, dispatch } = useContext(UserContext);
  const [userData, setUserData] = useState(state);
  const [error, setError] = useState<boolean>(false);

  const submitInformation = (): void => {
    setError(false);
    if (
      state.email === userData.email &&
      state.name === userData.name &&
      state.address === userData.address &&
      state.phone === userData.phone &&
      state.username === userData.username
    ) {
      setError(true);
    } else {
      dispatch("UPDATE", userData).then((response) => {
        if (response) {
          setOpen(false);
        }
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      className={modalStyles.root}
    >
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
            <br />
            <Wrapper>
              <ButtonWrapper>
                {error ? (
                  <Typography color="error">
                    Change at least 1 field or fill all of them!
                  </Typography>
                ) : null}
                <Button type="submit">Submit Changes</Button>
              </ButtonWrapper>
            </Wrapper>
          </InformationForm>
        </Paper>
      </Box>
    </Modal>
  );
};

export default ModalProfile;
