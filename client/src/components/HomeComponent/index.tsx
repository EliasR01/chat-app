import React, { ReactElement } from "react";
import {
  Paper,
  Button,
  Box,
  Container,
  Card,
  Input,
  Divider,
  LinearProgress,
} from "@material-ui/core";
import {
  usePaperStyles,
  useContainerStyles,
  useCardStyles,
  useBoxStyles,
  useButtonStyles,
  useInputStyles,
} from "./styles";
import {
  Text,
  Title,
  Wrapper,
  ForgotPassword,
  Error,
} from "./styledComponents";
import RegisterComponent from "./RegisterComponent/index";
import { Props } from "./types";

const HomeComponent = ({
  data,
  setData,
  login,
  openModal,
  setOpenModal,
  error,
  loading,
}: Props): ReactElement => {
  const paperStyles = usePaperStyles();
  const containerStyles = useContainerStyles();
  const textCardStyles = useCardStyles({ type: "" });
  const loginCardStyles = useCardStyles({ type: "login" });
  const buttonBoxStyles = useBoxStyles({ type: "b" });
  const textBoxStyles = useBoxStyles({ type: "" });
  const signInButtonStyles = useButtonStyles({ color: "#007fff" });
  const signUpButtonStyles = useButtonStyles({ color: "#35c824" });
  const inputStyles = useInputStyles();

  return (
    <Paper className={paperStyles.root}>
      <Container className={containerStyles.root}>
        <RegisterComponent open={openModal} handleModal={setOpenModal} />
        <Card className={textCardStyles.root}>
          <Box className={textBoxStyles.root}>
            <Title>HelloChat</Title>
            <Text>Connect to everyone, everywhere!</Text>
            <Text>No matter where you are</Text>
            <Text>Stay connected with your friends and family</Text>
          </Box>
          <Box className={buttonBoxStyles.root}>
            <Card className={loginCardStyles.root}>
              {loading ? <LinearProgress /> : null}
              <Wrapper>
                <Input
                  className={inputStyles.root}
                  placeholder="Email address"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </Wrapper>
              <Wrapper>
                <Input
                  className={inputStyles.root}
                  placeholder="Password"
                  type="password"
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
                {error ? <Error>{error}</Error> : null}
              </Wrapper>
              <Wrapper>
                <Button className={signInButtonStyles.root} onClick={login}>
                  Sign In
                </Button>
                <ForgotPassword>Forgot Password</ForgotPassword>
              </Wrapper>
              <Divider variant="middle"></Divider>
              <Wrapper>
                <Button
                  className={signUpButtonStyles.root}
                  onClick={() => setOpenModal(true)}
                >
                  Sign Up
                </Button>
              </Wrapper>
            </Card>
          </Box>
        </Card>
      </Container>
    </Paper>
  );
};

export default HomeComponent;
