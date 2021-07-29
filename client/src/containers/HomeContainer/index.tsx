import { ReactElement, useContext, useState, useEffect } from "react";
import HomeComponent from "../../components/HomeComponent";
import { UserContext } from "../../context/User/UserContext";
import { loginData, props } from "./types";

const HomeContainer = ({ history }: props): ReactElement => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<loginData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { dispatch } = useContext(UserContext);
  const cookie = document.cookie;
  useEffect(() => {
    if (cookie) {
      dispatch("RELOAD", { data: new FormData() }).then((response) => {
        if (response) {
          history.push("/chat");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = (email: string, password: string) => {
    setError(false);
    if (
      (loginData.email === "" || loginData.password === "") &&
      (email === "" || password === "")
    ) {
      setError("Must fill the fields!");
    } else {
      setLoading(true);
      try {
        const data =
          loginData.email !== ""
            ? loginData
            : {
                email,
                password,
                name: "",
              };

        dispatch("LOGIN", {
          data: new FormData(),
          email: data.email,
          password: data.password,
        }).then((response) => {
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
