import { combineReducers } from "redux";
import { ingredientsReducer } from "./ingredients";
import { constructorReducer } from "./constructor";
import { orderReducer } from "./order";
import { userReducer } from "./user";
import { wsFeedReducer } from "./ws-feed";
import { wsProfileReducer } from "./ws-profile";

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  construct: constructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: wsFeedReducer,
  profile: wsProfileReducer,
});
