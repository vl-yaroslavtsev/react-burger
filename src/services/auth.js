import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./api";
import { setCookie, deleteCookie } from "./utils";
import { getUser, SET_USER, CLEAR_USER } from "./actions/user";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

export function useAuth() {
  const { user, userRequest, userSuccess, userErrorMessage } = useSelector(
    (store) => store.user
  );
  const userLoaded = userSuccess || !!userErrorMessage;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userRequest && !userLoaded) {
      dispatch(getUser());
    }
  }, []);

  const signIn = async (params) => {
    const data = await login(params);
    console.log("signIn", data);
    const accessToken = data.accessToken.split("Bearer ")[1];
    if (accessToken) {
      setCookie("accessToken", accessToken);
    }

    localStorage.setItem("refreshToken", data.refreshToken);
    dispatch({ type: SET_USER, user: data.user });
    return data;
  };

  const signOut = async () => {
    await logout();
    deleteCookie("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch({ type: CLEAR_USER });
  };

  return {
    user,
    userLoaded,
    signIn,
    signOut,
  };
}
