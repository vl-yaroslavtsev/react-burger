import {
  WS_PROFILE_CONNECTION_SUCCESS,
  WS_PROFILE_CONNECTION_ERROR,
  WS_PROFILE_CONNECTION_CLOSED,
  WS_PROFILE_GET_MESSAGE,
} from "../actions/ws-profile";

import { wsProfileReducer as reducer } from "./ws-profile";

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

describe("wsProfileReducer reducer", () => {
  const initialState = {
    wsConnected: false,
    wsError: "",
    orders: [],
  };

  const connectedState = {
    ...initialState,
    wsConnected: true,
  };

  const getMessageState = {
    ...connectedState,
    orders,
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
        type: WS_PROFILE_CONNECTION_SUCCESS,
      })
    ).toEqual(connectedState);
  });

  it("должен получать заказы после подключения", () => {
    expect(
      reducer(connectedState, {
        type: WS_PROFILE_GET_MESSAGE,
        payload: { orders },
      })
    ).toEqual(getMessageState);
  });

  it("должен обрабатывать ошибку подключения", () => {
    expect(
      reducer(initialState, {
        type: WS_PROFILE_CONNECTION_ERROR,
        payload: { message: "failed to open socket" },
      })
    ).toEqual(errorState);
  });

  it("должен обрабатывать закрытие подключения", () => {
    expect(
      reducer(getMessageState, {
        type: WS_PROFILE_CONNECTION_CLOSED,
      })
    ).toEqual({
      ...getMessageState,
      wsConnected: false,
    });
  });
});
