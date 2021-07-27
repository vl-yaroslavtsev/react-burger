import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  WS_FEED_CONNECTION_START,
  WS_FEED_CONNECTION_CLOSE,
} from "../services/actions/ws-feed";

import {
  WS_PROFILE_CONNECTION_START,
  WS_PROFILE_CONNECTION_CLOSE,
} from "../services/actions/ws-profile";

import { getIngredients } from "../services/actions/ingredients";
import { loadOrderById } from "../services/api";

function selectOrder(order, ingredientsMap) {
  if (Object.keys(ingredientsMap).length === 0) {
    return order;
  }
  const ingredients = order.ingredients
    .map((id) => ingredientsMap[id] || id)
    .reduce((result, ingredient, index, ingredients) => {
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

export function useOrders(orders) {
  const { items: ingredients } = useSelector((store) => store.ingredients);

  const ingredientsMap = useMemo(
    () =>
      ingredients.reduce((map, item) => {
        map[item._id] = item;
        return map;
      }, {}),
    [ingredients]
  );

  const ordersList = useMemo(
    () => orders.map((order) => selectOrder(order, ingredientsMap)),
    [orders, ingredientsMap]
  );

  return { ordersList };
}

export function useOrderLoad(id) {
  const dispatch = useDispatch();

  const [serverOrder, setServerOrder] = useState();
  const [order, setOrder] = useState();
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState("");

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

  const ingredientsMap = useMemo(
    () =>
      ingredients.reduce((map, item) => {
        map[item._id] = item;
        return map;
      }, {}),
    [ingredients]
  );

  if (ingredients.length && serverOrder && !order) {
    setOrder(selectOrder(serverOrder, ingredientsMap));
  }

  useLayoutEffect(() => {
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
    wsConnected,
    orders,
    total,
    totalToday,
    wsError: ordersError,
  } = useSelector((store) => store.feed);

  useLayoutEffect(() => {
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

  let { ordersList } = useOrders(orders);

  ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const error = ordersError + ingredientsError;
  const loading = (!orders.length && !error) || ingredientsLoading;

  return {
    ordersList,
    error,
    loading,
  };
}
