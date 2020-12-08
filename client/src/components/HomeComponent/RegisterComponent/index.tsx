import React, { ReactElement, useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Card,
} from "@material-ui/core";
import { ModalComponentProps } from "./interfaces";
import { Wrapper, Error } from "../styledComponents";
import { useCardStyles, useDialogStyles, useInputStyles } from "./styles";
import { UserContext } from "../../../context/User/UserContext";
import { RegisterData } from "./types";

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
  };
  const [registerData, setRegisterData] = useState<RegisterData>(initialData);
  const [error, setError] = useState<string | boolean>(false);

  const signUp = (): void => {
    if (
      registerData.name === "" ||
      registerData.email === "" ||
      registerData.password === "" ||
      registerData.confirm === ""
    ) {
      setError("Must fill all the fields!");
    } else {
      if (registerData.password !== registerData.confirm) {
        console.log("Confirm password does not match!");
      } else {
        const { confirm, ...userData } = registerData;
        console.log(confirm);
        dispatch("REGISTER", userData).then((result) => {
          if (result) {
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
      <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
      <DialogContent>
        <Card className={cardStyles.root}>
          <Wrapper>
            <Input
              className={inputStyles.root}
              placeholder="Your name"
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
            />
          </Wrapper>
          <Wrapper>
            <Input
              className={inputStyles.root}
              placeholder="Your email"
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
          </Wrapper>
          <Wrapper>
            <Input
              type="password"
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
              className={inputStyles.root}
              placeholder="Confirm Password"
              onChange={(e) =>
                setRegisterData({ ...registerData, confirm: e.target.value })
              }
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
