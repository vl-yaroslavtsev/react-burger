import { ThunkAction } from "redux-thunk";
import { Action, ActionCreator } from "redux";
import store from "../store";
import { TConstructorActions } from "../actions/constructor";
import { TIngredientsActions } from "../actions/ingredients";
import { TOrderActions } from "../actions/order";
import { TUserActions } from "../actions/user";
import { TWsFeedActions } from "../actions/ws-feed";
import { TWsProfileActions } from "../actions/ws-profile";

type TApplicationActions =
  | TConstructorActions
  | TIngredientsActions
  | TOrderActions
  | TUserActions
  | TWsFeedActions
  | TWsProfileActions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ActionCreator<
  ThunkAction<ReturnType, RootState, TApplicationActions, Action>
>;
