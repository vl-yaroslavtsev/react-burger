import cn from "classnames";
import { useParams } from "react-router-dom";

import OrderInfo from "../components/order-info/order-info";
import { ordersList } from "../services/data";

import styles from "./profile-order.module.css";

export function ProfileOrderPage() {
  const { id } = useParams();
  const order = ordersList.find(({ number }) => number === id);
  return (
    <section className={cn(styles.container, "mt-2 mb-2")}>
      <h2 className={cn(styles.number, "text text_type_digits-default mb-10")}>
        #{order.number}
      </h2>
      <OrderInfo order={order} />
    </section>
  );
}
