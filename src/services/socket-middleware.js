import { getCookie } from "./utils";
import { refreshToken } from "./api";

export const socketMiddleware = (wsUrl, wsActions, useToken) => {
  return (store) => {
    let socket = null;

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
          dispatch({ type: onError, payload: event });
        };

        socket.onmessage = (event) => {
          const { data } = event;
          const parsedData = JSON.parse(data);
          const { success, ...restParsedData } = parsedData;

          if (
            restParsedData.message &&
            restParsedData.message === "Invalid or missing token"
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
          dispatch({ type: onClose, payload: event });
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
