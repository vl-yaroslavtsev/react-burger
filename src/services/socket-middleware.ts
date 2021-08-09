import { Middleware } from "redux";
import { getCookie } from "./utils";
import { refreshToken } from "./api";

type TWsActions = {
  wsInit: string;
  wsClose: string;
  wsSendMessage: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

export const socketMiddleware = (
  wsUrl: string,
  wsActions: TWsActions,
  useToken?: boolean
): Middleware => {
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
