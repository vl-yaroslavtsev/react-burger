import { IOrder } from "../types/data";

export const WS_PROFILE_CONNECTION_START = "WS_PROFILE_CONNECTION_START";
export const WS_PROFILE_CONNECTION_CLOSE = "WS_PROFILE_CONNECTION_CLOSE";
export const WS_PROFILE_SEND_MESSAGE = "WS_PROFILE_SEND_MESSAGE";
export const WS_PROFILE_CONNECTION_SUCCESS = "WS_PROFILE_CONNECTION_SUCCESS";
export const WS_PROFILE_CONNECTION_CLOSED = "WS_PROFILE_CONNECTION_CLOSED";
export const WS_PROFILE_CONNECTION_ERROR = "WS_PROFILE_CONNECTION_ERROR";
export const WS_PROFILE_GET_MESSAGE = "WS_PROFILE_GET_MESSAGE";

export interface IWsProfileConnectionStartAction {
  readonly type: typeof WS_PROFILE_CONNECTION_START;
}

export interface IWsProfileConnectionCloseAction {
  readonly type: typeof WS_PROFILE_CONNECTION_CLOSE;
}

export interface IWsProfileConnectionClosedAction {
  readonly type: typeof WS_PROFILE_CONNECTION_CLOSED;
}

export interface IWsProfileConnectionSuccessAction {
  readonly type: typeof WS_PROFILE_CONNECTION_SUCCESS;
}

export interface IWsProfileConnectionErrorAction {
  readonly type: typeof WS_PROFILE_CONNECTION_ERROR;
  readonly payload: { message: string };
}

export interface IWsProfileGetMessageAction {
  readonly type: typeof WS_PROFILE_GET_MESSAGE;
  readonly payload: {
    message?: string;
    orders: IOrder[];
    total: number;
    totalToday: number;
  };
}

export type TWsProfileActions =
  | IWsProfileConnectionStartAction
  | IWsProfileConnectionCloseAction
  | IWsProfileConnectionClosedAction
  | IWsProfileConnectionSuccessAction
  | IWsProfileConnectionErrorAction
  | IWsProfileGetMessageAction;
