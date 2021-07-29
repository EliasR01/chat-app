import { ReactElement, useContext, useEffect, useState } from "react";
import ChatComponent from "../../components/ChatComponent";
import { LinearProgress } from "@material-ui/core";
import { ChatProvider } from "../../context/Chat/ChatContext";
import { props } from "./types";
import { UserContext } from "../../context/User/UserContext";

const ChatContainer = ({ history }: props): ReactElement => {
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useContext(UserContext);
  const cookie = document.cookie;

  //Function that fetch the user information when user reloads the page
  const fetchReload = async (): Promise<void> => {
    await dispatch("RELOAD", { data: new FormData() })
      .then((response) => {
        if (!response) {
          history.push("/");
        }
      })
      .catch(() => {
        history.push("/");
      });
  };

  //Function that checks if there is a cookie and user data is empty. If true, it triggers the fetchReload Function.
  //If there is no cookie and no user data, returns to root page.
  //Otherwise, set loading to false and renders the ChatComponent
  useEffect(() => {
    if (cookie && state.name === "" && state.email === "") {
      fetchReload().then(() => {
        setLoading(false);
      });
    } else if (!cookie && state.name === "" && state.email === "") {
      history.push("/");
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnJsx = loading ? (
    <LinearProgress />
  ) : (
    <ChatProvider>
      <ChatComponent history={history} />
    </ChatProvider>
  );
  return returnJsx;
};

export default ChatContainer;
