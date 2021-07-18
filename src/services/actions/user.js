import { loadUser } from "../api";

export const GET_USER_REQUEST = "GET_USER_REQUEST";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_ERROR = "GET_USER_ERROR";
export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

export const getUser = () => async (dispatch, getState) => {
  dispatch({
    type: GET_USER_REQUEST,
  });
  try {
    const data = await loadUser();
    dispatch({
      type: GET_USER_SUCCESS,
      user: data.user,
    });
  } catch (err) {
    dispatch({
      type: GET_USER_ERROR,
      message: err.message,
    });
  }
};
