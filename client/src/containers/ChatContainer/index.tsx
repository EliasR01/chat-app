import React, { ReactElement, useContext, useEffect, useState } from "react";
import ChatComponent from "../../components/ChatComponent";
import { LinearProgress } from "@material-ui/core";
import { ChatProvider } from "../../context/Chat/ChatContext";
import { props } from "./types";
import { UserContext } from "../../context/User/UserContext";

const ChatContainer = ({ history }: props): ReactElement => {
  const [loading, setLoading] = useState(true);
  const { dispatch } = useContext(UserContext);

  //Function that fetch the user information when user reloads the page
  const fetchReload = async (): Promise<void> => {
    await dispatch("RELOAD", { name: "", email: "" })
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
    fetchReload().then(() => {
      setLoading(false);
    });
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
