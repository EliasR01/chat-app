import React, { createContext, useReducer, ReactElement } from "react";
import { userReducer } from "./userReducer";
import { userMiddleware } from "./userMiddleware";
import { User, Children } from "./types";

const initialState: User = {
  name: "",
  email: "",
};

const UserContext = createContext<{
  state: User;
  dispatch: (action: string, data: User) => Promise<boolean | string>;
}>({
  state: initialState,
  dispatch: async (): Promise<boolean | string> => false,
});

const UserProvider = ({ children }: Children): ReactElement => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const useMiddleware = (
    action: string,
    data: User
  ): Promise<boolean | string> => {
    return userMiddleware(action, data, dispatch);
  };

  return (
    <UserContext.Provider value={{ state, dispatch: useMiddleware }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
