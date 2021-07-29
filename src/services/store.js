import { compose, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { rootReducer } from "./reducers";
import { socketMiddleware } from "./socket-middleware";
import {
  WS_FEED_CONNECTION_START,
  WS_FEED_CONNECTION_CLOSE,
  WS_FEED_SEND_MESSAGE,
  WS_FEED_CONNECTION_SUCCESS,
  WS_FEED_CONNECTION_CLOSED,
  WS_FEED_CONNECTION_ERROR,
  WS_FEED_GET_MESSAGE,
} from "./actions/ws-feed";
import {
  WS_PROFILE_CONNECTION_START,
  WS_PROFILE_CONNECTION_CLOSE,
  WS_PROFILE_SEND_MESSAGE,
  WS_PROFILE_CONNECTION_SUCCESS,
  WS_PROFILE_CONNECTION_CLOSED,
  WS_PROFILE_CONNECTION_ERROR,
  WS_PROFILE_GET_MESSAGE,
} from "./actions/ws-profile";

const wsFeedOrders = {
  url: "wss://norma.nomoreparties.space/orders/all",
  actions: {
    wsInit: WS_FEED_CONNECTION_START,
    wsClose: WS_FEED_CONNECTION_CLOSE,
    wsSendMessage: WS_FEED_SEND_MESSAGE,
    onOpen: WS_FEED_CONNECTION_SUCCESS,
    onClose: WS_FEED_CONNECTION_CLOSED,
    onError: WS_FEED_CONNECTION_ERROR,
    onMessage: WS_FEED_GET_MESSAGE,
  },
};

const wsProfileOrders = {
  url: "wss://norma.nomoreparties.space/orders",
  actions: {
    wsInit: WS_PROFILE_CONNECTION_START,
    wsClose: WS_PROFILE_CONNECTION_CLOSE,
    wsSendMessage: WS_PROFILE_SEND_MESSAGE,
    onOpen: WS_PROFILE_CONNECTION_SUCCESS,
    onClose: WS_PROFILE_CONNECTION_CLOSED,
    onError: WS_PROFILE_CONNECTION_ERROR,
    onMessage: WS_PROFILE_GET_MESSAGE,
  },
};

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(
    thunk,
    socketMiddleware(wsFeedOrders.url, wsFeedOrders.actions),
    socketMiddleware(wsProfileOrders.url, wsProfileOrders.actions, true)
  )
);

export default createStore(rootReducer, enhancer);
