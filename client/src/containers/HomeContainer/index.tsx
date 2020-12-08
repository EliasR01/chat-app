import React, { ReactElement, useContext, useState } from "react";
import HomeComponent from "../../components/HomeComponent";
import { UserContext } from "../../context/User/UserContext";
import { LoginData, Props } from "./types";

const HomeContainer = ({ history }: Props): ReactElement => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { dispatch } = useContext(UserContext);

  const signIn = () => {
    setError(false);
    if (loginData.email === "" || loginData.password === "") {
      setError("Must fill the fields!");
    } else {
      setLoading(true);
      try {
        dispatch("LOGIN", loginData).then((response) => {
          setLoading(false);
          if (response === true) {
            history.push("/chat");
          } else {
            setError(response);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (error) {
    console.log(error);
  }

  return (
    <HomeComponent
      data={loginData}
      setData={setLoginData}
      login={signIn}
      openModal={openModal}
      setOpenModal={setOpenModal}
      error={error}
      loading={loading}
    />
  );
};

export default HomeContainer;
