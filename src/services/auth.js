import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./api";
import { getUser, SET_USER, CLEAR_USER } from "./actions/user";

export function useAuth() {
  const { user, userRequest, userSuccess, userErrorMessage } = useSelector(
    (store) => store.user
  );
  const userLoaded = userSuccess || !!userErrorMessage;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userRequest && !userLoaded) {
      console.log("auth: dispatch load user");
      dispatch(getUser());
    }
  }, []);

  const signIn = async (params) => {
    const data = await login(params);
    console.log("signIn", data);
    dispatch({ type: SET_USER, user: data.user });
    return data;
  };

  const signOut = async () => {
    await logout();
    dispatch({ type: CLEAR_USER });
  };

  return {
    user,
    userLoaded,
    signIn,
    signOut,
  };
}
