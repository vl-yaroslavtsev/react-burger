import { IOrder } from "../types/data";

export const WS_FEED_CONNECTION_START = "WS_FEED_CONNECTION_START";
export const WS_FEED_CONNECTION_CLOSE = "WS_FEED_CONNECTION_CLOSE";
export const WS_FEED_SEND_MESSAGE = "WS_FEED_SEND_MESSAGE";
export const WS_FEED_CONNECTION_SUCCESS = "WS_FEED_CONNECTION_SUCCESS";
export const WS_FEED_CONNECTION_CLOSED = "WS_FEED_CONNECTION_CLOSED";
export const WS_FEED_CONNECTION_ERROR = "WS_FEED_CONNECTION_ERROR";
export const WS_FEED_GET_MESSAGE = "WS_FEED_GET_MESSAGE";

export interface IWsFeedConnectionStartAction {
  readonly type: typeof WS_FEED_CONNECTION_START;
}

export interface IWsFeedConnectionCloseAction {
  readonly type: typeof WS_FEED_CONNECTION_CLOSE;
}

export interface IWsFeedConnectionClosedAction {
  readonly type: typeof WS_FEED_CONNECTION_CLOSED;
}

export interface IWsFeedConnectionSuccessAction {
  readonly type: typeof WS_FEED_CONNECTION_SUCCESS;
}

export interface IWsFeedConnectionErrorAction {
  readonly type: typeof WS_FEED_CONNECTION_ERROR;
  readonly payload: { message: string };
}

export interface IWsFeedGetMessageAction {
  readonly type: typeof WS_FEED_GET_MESSAGE;
  readonly payload: {
    message?: string;
    orders: IOrder[];
    total: number;
    totalToday: number;
  };
}

export type TWsFeedActions =
  | IWsFeedConnectionStartAction
  | IWsFeedConnectionCloseAction
  | IWsFeedConnectionClosedAction
  | IWsFeedConnectionSuccessAction
  | IWsFeedConnectionErrorAction
  | IWsFeedGetMessageAction;
