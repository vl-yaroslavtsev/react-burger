import cn from "classnames";
import { useParams } from "react-router-dom";

import OrderInfo from "../components/order-info/order-info";
import { ordersList } from "../services/data";

import styles from "./profile-order.module.css";

export function ProfileOrderPage() {
  const { id } = useParams();
  const order = ordersList.find(({ number }) => number === id);
  return (
    <section className={cn(styles.container)}>
      <OrderInfo order={order} />
    </section>
  );
}
