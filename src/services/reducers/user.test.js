import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";

import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  SET_USER,
  CLEAR_USER,
  getUser,
} from "../actions/user";

import { routes } from "../api";

import { userReducer as reducer } from "./user";

const user = {
  name: "Владимир",
  email: "vl.yaroslavtsev@gmail.com",
};

describe("user reducer", () => {
  const initialState = {
    user: null,
    userRequest: false,
    userSuccess: false,
    userErrorMessage: "",
  };

  const requestState = {
    ...initialState,
    userRequest: true,
  };

  const successState = {
    ...initialState,
    user,
    userSuccess: true,
  };

  const errorState = {
    ...initialState,
    userErrorMessage: "failed to fetch",
  };

  it("должен возвращать начальное состояние", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("должен отсылать запрос на пользователя", () => {
    expect(
      reducer(initialState, {
        type: GET_USER_REQUEST,
      })
    ).toEqual(requestState);
  });

  it("должен получать данные пользователя", () => {
    expect(
      reducer(requestState, {
        type: GET_USER_SUCCESS,
        user,
      })
    ).toEqual(successState);
  });

  it("должен обрабатывать ошибку", () => {
    expect(
      reducer(requestState, {
        type: GET_USER_ERROR,
        message: "failed to fetch",
      })
    ).toEqual(errorState);
  });

  it("должен устанавливать пользователя", () => {
    expect(
      reducer(initialState, {
        type: SET_USER,
        user,
      })
    ).toEqual({
      ...initialState,
      user,
    });
  });

  it("должен очищать пользователя", () => {
    expect(
      reducer(
        {
          ...initialState,
          user,
        },
        {
          type: CLEAR_USER,
        }
      )
    ).toEqual(initialState);
  });
});

describe("user async getUser", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("создает GET_USER_SUCCESS когда загрузка пользователя завершена", () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    fetchMock.getOnce(routes.auth.user, {
      body: { success: true, user },
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [
      { type: GET_USER_REQUEST },
      { type: GET_USER_SUCCESS, user },
    ];
    const store = mockStore({ items: [] });

    return store.dispatch(getUser()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("создает GET_USER_ERROR когда возникла ошибка сервера с ее описанием", () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    fetchMock.getOnce(routes.auth.user, {
      status: 403,
      body: { success: false, message: "Ошибочка вышла" },
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [
      { type: GET_USER_REQUEST },
      { type: GET_USER_ERROR, message: "Ошибочка вышла" },
    ];
    const store = mockStore({ items: [] });

    return store.dispatch(getUser()).then(() => {
      // Возвращаем асинхронный экшен
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("создает GET_USER_ERROR когда возникла ошибка сервера", () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    fetchMock.getOnce(routes.auth.user, 503);

    const expectedActions = [
      { type: GET_USER_REQUEST },
      { type: GET_USER_ERROR, message: "Статус: 503" },
    ];
    const store = mockStore({ items: [] });

    return store.dispatch(getUser()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
