import React, { ReactElement, useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Card,
  LinearProgress,
} from "@material-ui/core";
import { ModalComponentProps } from "./interfaces";
import { Wrapper, Error } from "../styledComponents";
import { useCardStyles, useDialogStyles, useInputStyles } from "./styles";
import { UserContext } from "../../../context/User/UserContext";
import { RegisterData } from "./types";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";

const RegisterComponent = ({
  open,
  handleModal,
}: ModalComponentProps): ReactElement => {
  const cardStyles = useCardStyles();
  const dialogStyles = useDialogStyles();
  const inputStyles = useInputStyles();
  const { dispatch } = useContext(UserContext);
  const initialData: RegisterData = {
    name: "",
    email: "",
    password: "",
    confirm: "",
    address: "",
    phone: "",
    username: "",
  };
  const [registerData, setRegisterData] = useState<RegisterData>(initialData);
  const [error, setError] = useState<string | boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const signUp = (): void => {
    setError(false);
    if (
      registerData.name === "" ||
      registerData.password === "" ||
      registerData.confirm === "" ||
      registerData.address === "" ||
      registerData.username === ""
    ) {
      setError("Must fill all the fields!");
    } else if (!isEmail(registerData.email)) {
      setError("Invalid email address!");
    } else if (!isMobilePhone(registerData.phone)) {
      setError(
        "Invalid phone number. Valid masks: (XXX)XXXXXXX or XXXX-XXXXXXX "
      );
    } else {
      if (registerData.password !== registerData.confirm) {
        console.log("Confirm password does not match!");
      } else {
        setLoading(true);
        const { confirm, ...userData } = registerData;
        console.log(confirm);
        dispatch("REGISTER", userData).then((result) => {
          if (result) {
            setRegisterData(initialData);
            setLoading(false);
            handleModal(false);
          }
        });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleModal}
      aria-labelledby="form-dialog-title"
      aria-describedby="simple-modal-description"
      classes={{ paper: dialogStyles.paper }}
    >
      {loading ? <LinearProgress /> : null}
      <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
      <DialogContent>
        <Card className={cardStyles.root}>
          <Wrapper>
            <Input
              error={error ? true : false}
              value={registerData.name}
              className={inputStyles.root}
              placeholder="Your name"
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
            />
          </Wrapper>
          <Wrapper>
            <Input
              error={error ? true : false}
              className={inputStyles.root}
              value={registerData.email}
              placeholder="Your email"
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
          </Wrapper>
          <Wrapper>
            <Input
              type="text"
              error={error ? true : false}
              value={registerData.username}
              className={inputStyles.root}
              placeholder="Your username"
              onChange={(e) =>
                setRegisterData({ ...registerData, username: e.target.value })
              }
            />
          </Wrapper>
          <Wrapper>
            <Input
              type="password"
              error={error ? true : false}
              value={registerData.password}
              className={inputStyles.root}
              placeholder="Your password"
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
          </Wrapper>
          <Wrapper>
            <Input
              type="password"
              error={error ? true : false}
              value={registerData.confirm}
              className={inputStyles.root}
              placeholder="Confirm Password"
              onChange={(e) =>
                setRegisterData({ ...registerData, confirm: e.target.value })
              }
            />
          </Wrapper>
          <Wrapper>
            <Input
              type="text"
              error={error ? true : false}
              value={registerData.address}
              className={inputStyles.root}
              placeholder="Enter address"
              onChange={(e) =>
                setRegisterData({ ...registerData, address: e.target.value })
              }
            />
          </Wrapper>
          <Wrapper>
            <Input
              type="text"
              error={error ? true : false}
              value={registerData.phone}
              className={inputStyles.root}
              placeholder="Enter phone"
              onChange={(e) => {
                setRegisterData({ ...registerData, phone: e.target.value });
              }}
            />
          </Wrapper>
          {error ? <Error>{error}</Error> : null}
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleModal(false)} color="primary">
          Close
        </Button>
        <Button color="secondary" onClick={signUp}>
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterComponent;
