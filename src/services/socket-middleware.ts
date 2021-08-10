import { Middleware, Dispatch } from "redux";
import { getCookie } from "./utils";
import { refreshToken } from "./api";
import { rootReducer } from "./reducers";
import {
  WS_FEED_CONNECTION_START,
  WS_FEED_CONNECTION_CLOSE,
  WS_FEED_SEND_MESSAGE,
  WS_FEED_CONNECTION_SUCCESS,
  WS_FEED_CONNECTION_CLOSED,
  WS_FEED_CONNECTION_ERROR,
  WS_FEED_GET_MESSAGE,
  TWsFeedActions,
} from "./actions/ws-feed";

import {
  WS_PROFILE_CONNECTION_START,
  WS_PROFILE_CONNECTION_CLOSE,
  WS_PROFILE_SEND_MESSAGE,
  WS_PROFILE_CONNECTION_SUCCESS,
  WS_PROFILE_CONNECTION_CLOSED,
  WS_PROFILE_CONNECTION_ERROR,
  WS_PROFILE_GET_MESSAGE,
  TWsProfileActions,
} from "./actions/ws-profile";

type TWsActions = {
  wsInit: typeof WS_FEED_CONNECTION_START | typeof WS_PROFILE_CONNECTION_START;
  wsClose: typeof WS_FEED_CONNECTION_CLOSE | typeof WS_PROFILE_CONNECTION_CLOSE;
  wsSendMessage: typeof WS_FEED_SEND_MESSAGE | typeof WS_PROFILE_SEND_MESSAGE;
  onOpen:
    | typeof WS_FEED_CONNECTION_SUCCESS
    | typeof WS_PROFILE_CONNECTION_SUCCESS;
  onClose:
    | typeof WS_FEED_CONNECTION_CLOSED
    | typeof WS_PROFILE_CONNECTION_CLOSED;
  onError: typeof WS_FEED_CONNECTION_ERROR | typeof WS_PROFILE_CONNECTION_ERROR;
  onMessage: typeof WS_FEED_GET_MESSAGE | typeof WS_PROFILE_GET_MESSAGE;
};

export const socketMiddleware = (
  wsUrl: string,
  wsActions: TWsActions,
  useToken?: boolean
): Middleware<
  {},
  ReturnType<typeof rootReducer>,
  Dispatch<TWsFeedActions | TWsProfileActions>
> => {
  return (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;
      const { type, payload } = action;
      const {
        wsInit,
        wsClose,
        wsSendMessage,
        onOpen,
        onClose,
        onError,
        onMessage,
      } = wsActions;
      if (type === wsInit) {
        let url = wsUrl;
        if (useToken) {
          const accessToken = getCookie("accessToken");
          url += `?token=${accessToken}`;
        }
        socket = new WebSocket(url);
      }
      if (socket) {
        socket.onopen = (event) => {
          dispatch({ type: onOpen, payload: event });
        };

        socket.onerror = (event) => {
          dispatch({
            type: onError,
            payload: { message: "Ошибка соединения" },
          });
        };

        socket.onmessage = (event) => {
          const { data } = event;
          const parsedData = JSON.parse(data);
          const { success, ...restParsedData } = parsedData;

          if (
            restParsedData.message &&
            restParsedData.message === "Invalid or missing token" &&
            socket
          ) {
            socket.close();
            refreshToken().then(() => {
              dispatch({ type: wsInit });
            });
          } else {
            dispatch({ type: onMessage, payload: restParsedData });
          }
        };

        socket.onclose = (event) => {
          dispatch({ type: onClose });
        };

        if (type === wsSendMessage) {
          const message = { ...payload };
          socket.send(JSON.stringify(message));
        }

        if (type === wsClose) {
          socket.close();
          socket = null;
        }
      }

      next(action);
    };
  };
};
