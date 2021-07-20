import cn from "classnames";
import { useParams } from "react-router-dom";

import OrderInfo from "../components/order-info/order-info";
import { ordersList } from "../services/data";

import styles from "./feed-order.module.css";

export function FeedOrderPage() {
  const { id } = useParams();
  const order = ordersList.find(({ number }) => number === id);
  return (
    <section className={cn(styles.container)}>
      <OrderInfo order={order} />
    </section>
  );
}
