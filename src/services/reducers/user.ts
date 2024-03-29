import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  SET_USER,
  CLEAR_USER,
} from "../actions/user";

import { TUserActions } from "../actions/user";
import { IUser } from "../types/data";

export interface IUserState {
  user: IUser | null;
  userRequest: boolean;
  userSuccess: boolean;
  userErrorMessage: string;
}

const userState: IUserState = {
  user: null,
  userRequest: false,
  userSuccess: false,
  userErrorMessage: "",
};

export const userReducer = (
  state: IUserState = userState,
  action: TUserActions
) => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return {
        ...state,
        userRequest: true,
        userSuccess: false,
        userErrorMessage: "",
        user: null,
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        userRequest: false,
        userSuccess: true,
        userErrorMessage: "",
        user: action.user,
      };

    case GET_USER_ERROR:
      return {
        ...state,
        userRequest: false,
        userSuccess: false,
        userErrorMessage: action.message,
        user: null,
      };

    case SET_USER:
      return {
        ...state,
        user: action.user,
      };

    case CLEAR_USER:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};
