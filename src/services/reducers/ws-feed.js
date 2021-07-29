import {
  WS_FEED_CONNECTION_SUCCESS,
  WS_FEED_CONNECTION_ERROR,
  WS_FEED_CONNECTION_CLOSED,
  WS_FEED_GET_MESSAGE,
} from "../actions/ws-feed";

const initialState = {
  wsConnected: false,
  wsError: "",
  orders: [],
  total: 0,
  totalToday: 0,
};

export const wsFeedReducer = (state = initialState, action) => {
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
