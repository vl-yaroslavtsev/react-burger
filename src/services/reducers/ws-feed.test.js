import {
  WS_FEED_CONNECTION_SUCCESS,
  WS_FEED_CONNECTION_ERROR,
  WS_FEED_CONNECTION_CLOSED,
  WS_FEED_GET_MESSAGE,
} from "../actions/ws-feed";

import { wsFeedReducer as reducer } from "./ws-feed";

const orders = [
  {
    number: 1254,
    name: "Марсианский бургер",
    ingredients: ["sdfssd", "asdfsdf", "23dfgdrfg"],
  },
  {
    number: 1253,
    name: "Экзо-планаго бургер",
    ingredients: ["ethtrj", "assfgdfgdfsdf", "23dfgdrfg"],
  },
];
const total = 1323;
const totalToday = 23;

describe("wsFeedReducer reducer", () => {
  const initialState = {
    wsConnected: false,
    wsError: "",
    orders: [],
    total: 0,
    totalToday: 0,
  };

  const connectedState = {
    ...initialState,
    wsConnected: true,
  };

  const getMessageState = {
    ...connectedState,
    orders,
    total,
    totalToday,
  };

  const errorState = {
    ...initialState,
    wsError: "failed to open socket",
    wsConnected: false,
  };

  it("должен возвращать начальное состояние", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("должен подключаться к веб-сокету", () => {
    expect(
      reducer(initialState, {
        type: WS_FEED_CONNECTION_SUCCESS,
      })
    ).toEqual(connectedState);
  });

  it("должен получать заказы после подключения", () => {
    expect(
      reducer(connectedState, {
        type: WS_FEED_GET_MESSAGE,
        payload: { orders, total, totalToday },
      })
    ).toEqual(getMessageState);
  });

  it("должен обрабатывать ошибку подключения", () => {
    expect(
      reducer(initialState, {
        type: WS_FEED_CONNECTION_ERROR,
        payload: { message: "failed to open socket" },
      })
    ).toEqual(errorState);
  });

  it("должен обрабатывать закрытие подключения", () => {
    expect(
      reducer(getMessageState, {
        type: WS_FEED_CONNECTION_CLOSED,
      })
    ).toEqual({
      ...getMessageState,
      wsConnected: false,
    });
  });
});
