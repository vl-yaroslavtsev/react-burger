import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./api";
import { setCookie, deleteCookie } from "./utils";
import { getUser, SET_USER, CLEAR_USER } from "./actions/user";

export function useAuth() {
  const { user, userSuccess } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const signIn = async (params) => {
    const data = await login(params);
    const authToken = data.authToken.split("Bearer ")[1];
    if (authToken) {
      setCookie("token", authToken);
    }
    localStorage.setItem("refreshToken", data.refreshToken);
    dispatch({ type: SET_USER, user: { ...data.user, id: data.user._id } });
  };

  const signOut = async () => {
    await logout();
    deleteCookie("token");
    localStorage.removeItem("refreshToken");
    dispatch({ type: CLEAR_USER });
  };

  return {
    user,
    userLoaded: userSuccess,
    getUser,
    signIn,
    signOut,
  };
}
