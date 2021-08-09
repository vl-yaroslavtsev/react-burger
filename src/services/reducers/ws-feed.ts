import {
  WS_FEED_CONNECTION_SUCCESS,
  WS_FEED_CONNECTION_ERROR,
  WS_FEED_CONNECTION_CLOSED,
  WS_FEED_GET_MESSAGE,
  TWsFeedActions,
} from "../actions/ws-feed";
import { IOrder } from "../types/data";

export interface IWsFeedState {
  orders: IOrder[];
  total: number;
  totalToday: number;
  wsConnected: boolean;
  wsError: string;
}

const initialState: IWsFeedState = {
  wsConnected: false,
  wsError: "",
  orders: [],
  total: 0,
  totalToday: 0,
};

export const wsFeedReducer = (
  state: IWsFeedState = initialState,
  action: TWsFeedActions
) => {
  switch (action.type) {
    case WS_FEED_CONNECTION_SUCCESS:
      return {
        ...state,
        wsError: "",
        wsConnected: true,
      };

    case WS_FEED_CONNECTION_ERROR:
      return {
        ...state,
        wsError: action.payload.message,
        wsConnected: false,
      };

    case WS_FEED_CONNECTION_CLOSED:
      return {
        ...state,
        wsError: "",
        wsConnected: false,
      };

    case WS_FEED_GET_MESSAGE:
      if (action.payload.message) {
        return {
          ...state,
          wsError: action.payload.message,
          orders: [],
          total: 0,
          totalToday: 0,
        };
      }

      return {
        ...state,
        wsError: "",
        orders: action.payload.orders,
        total: action.payload.total,
        totalToday: action.payload.totalToday,
      };

    default:
      return state;
  }
};
