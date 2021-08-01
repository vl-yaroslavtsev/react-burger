import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";

import {
  CHECKOUT_ORDER_REQUEST,
  CHECKOUT_ORDER_SUCCESS,
  CHECKOUT_ORDER_ERROR,
  CLEAR_ORDER,
  doCheckoutOrder,
} from "../actions/order";

import { routes } from "../api";

import { orderReducer as reducer } from "./order";
import { CLEAR_USER } from "../actions/user";

const orderNumber = 1355;

describe("order reducer", () => {
  const initialState = {
    number: null,
    checkoutRequest: false,
    checkoutSuccess: false,
    checkoutErrorMessage: "",
  };

  const requestState = {
    ...initialState,
    checkoutRequest: true,
  };

  const successState = {
    ...initialState,
    number: orderNumber,
    checkoutSuccess: true,
  };

  const errorState = {
    ...initialState,
    checkoutErrorMessage: "failed to fetch",
  };

  it("должен возвращать начальное состояние", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("должен отсылать запрос на формирование заказа", () => {
    expect(
      reducer(initialState, {
        type: CHECKOUT_ORDER_REQUEST,
      })
    ).toEqual(requestState);
  });

  it("должен получать номер заказа", () => {
    expect(
      reducer(requestState, {
        type: CHECKOUT_ORDER_SUCCESS,
        number: orderNumber,
      })
    ).toEqual(successState);
  });

  it("должен обрабатывать ошибку", () => {
    expect(
      reducer(requestState, {
        type: CHECKOUT_ORDER_ERROR,
        message: "failed to fetch",
      })
    ).toEqual(errorState);
  });

  it("должен очищать заказ", () => {
    expect(
      reducer(
        {
          ...initialState,
          number: orderNumber,
        },
        {
          type: CLEAR_ORDER,
        }
      )
    ).toEqual(initialState);
  });
});

describe("order async doCheckoutOrder", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const bunItem = {
    type: "bun",
    title: "Краторная булка R2-D3",
    price: 1200,
  };

  const stateItems = [
    {
      _id: "uio",
      key: "uio24523523455325",
      title: "Биокотлета",
      price: 1000,
    },
    {
      _id: "asd",
      key: "asd24523523455325",
      title: "Экзосалат",
      price: 1200,
    },
    {
      _id: "rty",
      key: "rty24523523455325",
      title: "Соус космический",
      price: 600,
    },
  ];

  afterEach(() => {
    fetchMock.restore();
  });

  it("создает CHECKOUT_ORDER_SUCCESS когда получен номер заказа", () => {
    fetchMock.postOnce(routes.orders, {
      body: { success: true, order: { number: orderNumber } },
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [
      { type: CHECKOUT_ORDER_REQUEST },
      { type: CHECKOUT_ORDER_SUCCESS, number: orderNumber },
    ];
    const store = mockStore({
      order: { number: null },
      construct: {
        bunItem,
        items: stateItems,
      },
    });

    return store.dispatch(doCheckoutOrder()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("создает CHECKOUT_ORDER_ERROR когда нет булки", () => {
    const expectedActions = [
      {
        type: CHECKOUT_ORDER_ERROR,
        message: "Для оформления заказа добавьте булку!",
      },
    ];
    const store = mockStore({
      order: { number: null },
      construct: {
        bunItem: null,
        items: stateItems,
      },
    });

    return store.dispatch(doCheckoutOrder()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it("создает CHECKOUT_ORDER_ERROR когда возникла ошибка сервера с ее описанием", () => {
    fetchMock.postOnce(routes.orders, {
      status: 403,
      body: { success: false, message: "Ошибочка вышла" },
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [
      { type: CHECKOUT_ORDER_REQUEST },
      { type: CHECKOUT_ORDER_ERROR, message: "Ошибочка вышла" },
    ];
    const store = mockStore({
      order: { number: null },
      construct: {
        bunItem,
        items: stateItems,
      },
    });

    return store.dispatch(doCheckoutOrder()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("создает CHECKOUT_ORDER_ERROR когда возникла ошибка сервера", () => {
    fetchMock.postOnce(routes.orders, 503);
    const expectedActions = [
      { type: CHECKOUT_ORDER_REQUEST },
      { type: CHECKOUT_ORDER_ERROR, message: "Статус: 503" },
    ];
    const store = mockStore({
      order: { number: null },
      construct: {
        bunItem,
        items: stateItems,
      },
    });

    return store.dispatch(doCheckoutOrder()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
