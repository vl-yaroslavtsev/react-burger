import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";

import {
  GET_INGREDIENTS_REQUEST,
  GET_INGREDIENTS_SUCCESS,
  GET_INGREDIENTS_ERROR,
  getIngredients,
} from "../actions/ingredients";

import { routes } from "../api";

import { ingredientsReducer as reducer } from "./ingredients";

const ingredients = [
  {
    _id: "fgh",
    type: "bun",
    title: "Краторная булка R2-D3",
    price: 1200,
  },
  {
    _id: "uio",
    type: "main",
    title: "Биокотлета",
    price: 1000,
  },
  {
    _id: "asd",
    title: "Экзосалат",
    type: "main",
    price: 1200,
  },
  {
    _id: "rty",
    type: "main",
    title: "Соус космический",
    price: 600,
  },
];

describe("ingredients reducer", () => {
  const initialState = {
    items: [],
    itemsRequest: false,
    itemsSuccess: false,
    itemsErrorMessage: "",
  };

  const requestState = {
    ...initialState,
    itemsRequest: true,
  };

  const successState = {
    ...initialState,
    items: ingredients,
    itemsSuccess: true,
  };

  const errorState = {
    ...initialState,
    itemsErrorMessage: "failed to fetch",
  };

  it("должен возвращать начальное состояние", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("должен отсылать запрос", () => {
    expect(
      reducer(initialState, {
        type: GET_INGREDIENTS_REQUEST,
      })
    ).toEqual(requestState);
  });

  it("должен получаеть данные", () => {
    expect(
      reducer(requestState, {
        type: GET_INGREDIENTS_SUCCESS,
        items: ingredients,
      })
    ).toEqual(successState);
  });

  it("должен обрабатывать ошибку", () => {
    expect(
      reducer(requestState, {
        type: GET_INGREDIENTS_ERROR,
        message: "failed to fetch",
      })
    ).toEqual(errorState);
  });
});

describe("ingredients async getIngredients", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("создает GET_INGREDIENTS_SUCCESS когда загрузка ингредиентов завершена", () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    fetchMock.getOnce(routes.ingredients, {
      body: { success: true, data: ingredients },
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [
      { type: GET_INGREDIENTS_REQUEST },
      { type: GET_INGREDIENTS_SUCCESS, items: ingredients },
    ];
    const store = mockStore({ items: [] });

    return store.dispatch(getIngredients()).then(() => {
      // Возвращаем асинхронный экшен
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("создает GET_INGREDIENTS_ERROR когда возникла ошибка сервера с ее описанием", () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    fetchMock.getOnce(routes.ingredients, {
      status: 403,
      body: { success: false, message: "Ошибочка вышла" },
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [
      { type: GET_INGREDIENTS_REQUEST },
      { type: GET_INGREDIENTS_ERROR, message: "Ошибочка вышла" },
    ];
    const store = mockStore({ items: [] });

    return store.dispatch(getIngredients()).then(() => {
      // Возвращаем асинхронный экшен
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("создает GET_INGREDIENTS_ERROR когда возникла ошибка сервера", () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    fetchMock.getOnce(routes.ingredients, 503);

    const expectedActions = [
      { type: GET_INGREDIENTS_REQUEST },
      { type: GET_INGREDIENTS_ERROR, message: "Статус: 503" },
    ];
    const store = mockStore({ items: [] });

    return store.dispatch(getIngredients()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
