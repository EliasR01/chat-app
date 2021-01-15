import { User, Action } from "./types";

export const userReducer = (state: User, action: Action): User => {
  switch (action.type) {
    case "LOGIN": {
      const data = action.payload;
      return { ...state, ...data };
    }
    case "REGISTER": {
      const data = action.payload;
      return { ...state, ...data };
    }
    case "LOGOUT": {
      return { name: "", email: "" };
    }
    case "RELOAD": {
      const data = action.payload;
      return { ...state, ...data };
    }
    case "UPDATE": {
      const data = action.payload;
      return { ...state, ...data };
    }
    default:
      return state;
  }
};
