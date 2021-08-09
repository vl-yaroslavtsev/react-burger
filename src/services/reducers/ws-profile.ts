import {
  WS_PROFILE_CONNECTION_SUCCESS,
  WS_PROFILE_CONNECTION_ERROR,
  WS_PROFILE_CONNECTION_CLOSED,
  WS_PROFILE_GET_MESSAGE,
} from "../actions/ws-profile";

import { TWsProfileActions } from "../actions/ws-profile";
import { IOrder } from "../types/data";

export interface IWsProfileState {
  orders: IOrder[];
  wsConnected: boolean;
  wsError: string;
}

const initialState: IWsProfileState = {
  wsConnected: false,
  wsError: "",
  orders: [],
};

export const wsProfileReducer = (
  state: IWsProfileState = initialState,
  action: TWsProfileActions
) => {
  switch (action.type) {
    case WS_PROFILE_CONNECTION_SUCCESS:
      return {
        ...state,
        wsError: "",
        wsConnected: true,
      };

    case WS_PROFILE_CONNECTION_ERROR:
      return {
        ...state,
        wsError: action.payload.message,
        wsConnected: false,
      };

    case WS_PROFILE_CONNECTION_CLOSED:
      return {
        ...state,
        wsError: "",
        wsConnected: false,
      };

    case WS_PROFILE_GET_MESSAGE:
      if (action.payload.message) {
        return {
          ...state,
          wsError: action.payload.message,
          orders: [],
        };
      }

      return {
        ...state,
        wsError: "",
        orders: action.payload.orders,
      };

    default:
      return state;
  }
};
