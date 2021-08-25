import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "../services/hooks";

import {
  WS_FEED_CONNECTION_START,
  WS_FEED_CONNECTION_CLOSE,
} from "./actions/ws-feed";

import {
  WS_PROFILE_CONNECTION_START,
  WS_PROFILE_CONNECTION_CLOSE,
} from "./actions/ws-profile";

import { getIngredients } from "./actions/ingredients";
import { loadOrderById } from "./api";
import {
  IIngredient,
  IOrder,
  IOrderIngredient,
  IFullOrder,
} from "./types/data";

function useIngredientsMap(ingredients: IIngredient[]) {
  return useMemo(
    () =>
      ingredients.reduce((map: { [key: string]: IIngredient }, item) => {
        map[item._id] = item;
        return map;
      }, {}),
    [ingredients]
  );
}

function getFullOrder(
  order: IOrder,
  ingredientsMap: { [key: string]: IIngredient }
): IFullOrder | null {
  if (Object.keys(ingredientsMap).length === 0) {
    return null;
  }

  const ingredients = order.ingredients
    .filter((id) => !!id)
    .map((id) => ingredientsMap[id])
    .reduce((result: IOrderIngredient[], ingredient) => {
      const found = result.find(({ _id }) => ingredient._id === _id);

      if (found) {
        if (found.type !== "bun") {
          found.count++;
        }
        return result;
      }

      result.push({
        ...ingredient,
        count: ingredient.type === "bun" ? 2 : 1,
      });
      return result;
    }, []);

  return {
    ...order,
    price: ingredients.reduce(
      (total, { count, price }) => total + count * price,
      0
    ),
    ingredients,
  };
}

const statusMap = {
  created: "Создан",
  pending: "Готовится",
  done: "Выполнен",
  canceled: "Отменен",
};

export function translateStatus(status: IFullOrder["status"]) {
  return statusMap[status] || status;
}

export function useOrders(orders: IOrder[]) {
  const { items: ingredients } = useSelector((store) => store.ingredients);

  const ingredientsMap = useIngredientsMap(ingredients);

  const ordersList = useMemo(
    () =>
      orders
        .map((order) => getFullOrder(order, ingredientsMap))
        .filter((order): order is IFullOrder => order !== null),
    [orders, ingredientsMap]
  );

  return { ordersList };
}

export function useOrderLoad(id: string) {
  const dispatch = useDispatch();

  const [serverOrder, setServerOrder] = useState<IOrder>();
  const [order, setOrder] = useState<IFullOrder | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState("");

  const {
    items: ingredients,
    itemsErrorMessage: ingredientsError,
    itemsRequest: ingredientsLoading,
  } = useSelector((store) => store.ingredients);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientsMap = useIngredientsMap(ingredients);

  if (ingredients.length && serverOrder && !order) {
    setOrder(getFullOrder(serverOrder, ingredientsMap));
  }

  useEffect(() => {
    setOrderLoading(true);
    loadOrderById(id)
      .then((data) => {
        setServerOrder(data);
      })
      .catch((err) => setOrderError(err))
      .finally(() => {
        setOrderLoading(false);
      });
  }, [id]);

  const loading = ingredientsLoading || orderLoading;
  const error = ingredientsError + orderError;

  return { order, loading, error };
}

export function useFeedOrders() {
  const dispatch = useDispatch();

  const {
    orders,
    total,
    totalToday,
    wsError: ordersError,
  } = useSelector((store) => store.feed);

  useEffect(() => {
    dispatch({ type: WS_FEED_CONNECTION_START });

    return () => {
      dispatch({ type: WS_FEED_CONNECTION_CLOSE });
    };
  }, [dispatch]);

  const {
    items: ingredients,
    itemsErrorMessage: ingredientsError,
    itemsRequest: ingredientsLoading,
  } = useSelector((store) => store.ingredients);

  useLayoutEffect(() => {
    if (ingredients.length === 0) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients.length]);

  const { ordersList } = useOrders(orders);

  const completeNumbers = useMemo(
    () =>
      orders
        .filter(({ status }) => status === "done")
        .slice(0, 20)
        .map(({ number }) => number),
    [orders]
  );

  const progressNumbers = useMemo(
    () =>
      orders
        .filter(({ status }) => status === "pending")
        .slice(0, 20)
        .map(({ number }) => number),
    [orders]
  );

  const error = ordersError + ingredientsError;
  const loading = (!orders.length && !error) || ingredientsLoading;

  return {
    ordersList,
    total,
    totalToday,
    completeNumbers,
    progressNumbers,
    error,
    loading,
  };
}

export function useProfileOrders() {
  const dispatch = useDispatch();

  const { orders, wsError: ordersError } = useSelector(
    (store) => store.profile
  );

  useLayoutEffect(() => {
    dispatch({ type: WS_PROFILE_CONNECTION_START });

    return () => {
      dispatch({ type: WS_PROFILE_CONNECTION_CLOSE });
    };
  }, [dispatch]);

  const {
    items: ingredients,
    itemsErrorMessage: ingredientsError,
    itemsRequest: ingredientsLoading,
  } = useSelector((store) => store.ingredients);

  useLayoutEffect(() => {
    if (ingredients.length === 0) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients.length]);

  const { ordersList } = useOrders(orders);

  ordersList.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const error = ordersError + ingredientsError;
  const loading = (!orders.length && !error) || ingredientsLoading;

  return {
    ordersList,
    error,
    loading,
  };
}
