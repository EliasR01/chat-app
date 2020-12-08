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
    default:
      return state;
  }
};
