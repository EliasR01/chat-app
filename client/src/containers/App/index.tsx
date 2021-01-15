import React, { ReactElement } from "react";
import HomeContainer from "../HomeContainer/index";
import ChatContainer from "../ChatContainer/index";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "../../theme";
import { UserProvider } from "../../context/User/UserContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = (): ReactElement => {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" component={HomeContainer} />
            <Route path="/chat" component={ChatContainer} />
          </Switch>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
