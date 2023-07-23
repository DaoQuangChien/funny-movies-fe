import {
  Dispatch,
  FC,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";
import request from "../services/request";
import {
  Action,
  eAction,
  iAuthenActions,
  iSignInParams,
  iState,
  iUser,
} from "../types";

export const getUserData = () =>
  localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

export const INIT_STATE: iState = {
  userData: null,
  isSignIn: false,
};

const authReducer: (state: iState, action: Action) => iState = (
  state,
  action
) => {
  switch (action.type) {
    case eAction.SIGN_IN: {
      const { userData } = action.payload;

      localStorage.setItem("user", JSON.stringify(userData));
      return {
        userData,
        isSignIn: true,
      };
    }
    case eAction.SIGN_OUT: {
      localStorage.removeItem("user");
      return INIT_STATE;
    }
    default:
      return state;
  }
};

export const AuthContext = createContext<[iState, Dispatch<Action>] | null>(
  null
);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INIT_STATE);

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthenActions: () => iAuthenActions = () => {
  const [state, dispatch] = useContext(AuthContext)!;
  const signIn = ({ url, email, password }: iSignInParams) =>
    request
      .post<unknown, iUser>(url, {
        email,
        password,
      })
      .then((res) => {
        dispatch({
          type: eAction.SIGN_IN,
          payload: {
            userData: res,
          },
        });
      });
  const signOut = () => {
    dispatch({ type: eAction.SIGN_OUT });
  };

  return {
    signIn,
    signOut,
    userData: state?.userData,
    isSignIn: state?.isSignIn,
  };
};
