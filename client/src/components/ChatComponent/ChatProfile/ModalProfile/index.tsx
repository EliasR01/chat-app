import React, {
  ReactElement,
  useContext,
  useState,
  useRef,
  ChangeEvent,
} from "react";
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
import { Props } from "./types";
import {
  useBoxStyles,
  useModalStyles,
  usePaperStyles,
  useTextFieldStyles,
  useButtonStyles,
} from "./styles";
import { Wrapper, InformationForm, ButtonWrapper } from "./styledComponents";
import { UserContext } from "../../../../context/User/UserContext";

const ModalProfile = ({ open, setOpen, setResponse }: Props): ReactElement => {
  const boxStyles = useBoxStyles();
  const modalStyles = useModalStyles();
  const paperStyles = usePaperStyles({ form: false });
  const formPaperStyles = usePaperStyles({ form: true });
  const textFieldStyles = useTextFieldStyles();
  const buttonStyles = useButtonStyles();
  const { state, dispatch } = useContext(UserContext);
  const [userData, setUserData] = useState(state);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [fileURL, setFileURL] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [didFileChanged, setDidFileChanged] = useState<boolean>(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const submitInformation = (): void => {
    setError(null);
    if (
      state.email === userData.email &&
      state.name === userData.name &&
      state.address === userData.address &&
      state.phone === userData.phone &&
      state.username === userData.username &&
      !didFileChanged
    ) {
      setError("You must change at least one value!");
    } else {
      if (password !== confirmPassword) {
        setError("Confirm password does not match");
      } else {
        // const data = {
        //   ...userData,
        //   currUsername: state.username,
        //   password: password,
        //   file,
        //   fileURL,
        // };

        const formData = new FormData();
        userData.address && formData.append("address", userData.address);
        userData.username && formData.append("username", userData.username);
        userData.phone && formData.append("phone", userData.phone);
        state.username && formData.append("currUsername", state.username);
        formData.append("password", password);
        formData.append("fileURL", fileURL);
        file && formData.append("file", file);

        dispatch("UPDATE", { data: formData, email: state.email, password })
          .then((response) => {
            setResponse(response);
            setUserData(state);
            setOpen(false);
          })
          .catch((err) => {
            setResponse(err);
            setOpen(false);
          });
      }
    }
  };

  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = URL.createObjectURL(
      e.target && e.target.files && e.target.files[0]
    );
    setFileURL(file);
    setDidFileChanged(true);
    setFile(e.target && e.target.files && e.target.files[0]);
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
                    <Avatar src={fileURL.toString()} />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Change your profile photo"
                    secondary="Profile-pic.jpg"
                  />
                </ListItem>
              </List>
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/x-png,image/jpeg,image/jpg"
                ref={inputFileRef}
                onChange={(e) => uploadFile(e)}
              />
              <Button
                onClick={() => {
                  inputFileRef.current?.click();
                }}
                className={buttonStyles.root}
              >
                Change
              </Button>
            </Wrapper>
          </Paper>
          <br />
          <Paper elevation={2} className={formPaperStyles.root}>
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
                  <Button type="submit" className={buttonStyles.root}>
                    Submit Changes
                  </Button>
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
