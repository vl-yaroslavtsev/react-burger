import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "../services/hooks";
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
      dispatch(getUser());
    }
  }, [dispatch, userLoaded, userRequest]);

  const signIn = useCallback(
    async (params) => {
      const data = await login(params);
      //console.log("signIn", data);
      dispatch({ type: SET_USER, user: data.user });
      return data;
    },
    [dispatch]
  );

  const signOut = useCallback(async () => {
    await logout();
    dispatch({ type: CLEAR_USER });
  }, [dispatch]);

  return {
    user,
    userLoaded,
    signIn,
    signOut,
  };
}
