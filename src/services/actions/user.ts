import { loadUser } from "../api";
import { AppDispatch, AppThunk } from "../types";
import { IUser } from "../types/data";

export const GET_USER_REQUEST = "GET_USER_REQUEST";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_ERROR = "GET_USER_ERROR";
export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

export interface IGetUserRequestAction {
  readonly type: typeof GET_USER_REQUEST;
}

export interface IGetUserSuccessAction {
  readonly type: typeof GET_USER_SUCCESS;
  readonly user: IUser;
}

export interface IGetUserErrorAction {
  readonly type: typeof GET_USER_ERROR;
  readonly message: string;
}

export interface ISetUserAction {
  readonly type: typeof SET_USER;
  readonly user: IUser;
}

export interface IClearUserAction {
  readonly type: typeof CLEAR_USER;
}

export type TUserActions =
  | IGetUserRequestAction
  | IGetUserSuccessAction
  | IGetUserErrorAction
  | ISetUserAction
  | IClearUserAction;

export const getUser: AppThunk =
  () => async (dispatch: AppDispatch, getState) => {
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
