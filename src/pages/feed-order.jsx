import cn from "classnames";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import OrderInfo from "../components/order-info/order-info";
import { useOrderLoad } from "../services/orders";
import styles from "./feed-order.module.css";

export function FeedOrderPage() {
  const { id } = useParams();

  const { order, loading, error } = useOrderLoad(id);

  if (error) {
    return <section className={cn(styles.container, "mt-2 mb-2 text text_type_main-default")}>
      <p className={styles.error}>Не удалось найти заказ {id}. {error}</p>
    </section>
  }

  if (loading) {
    return <section className={cn(styles.container, "mt-2 mb-2")}>
      <h2 className={cn(styles.number, "text text_type_digits-default mb-10")}>
        <div className={styles.skeleton}
          style={{ width: 200 }}>&nbsp;</div>
      </h2>
      <div className={styles.skeleton} style={{ width: 640, height: 70 }}></div>
    </section>
  }

  return order && (
    <section className={cn(styles.container, "mt-2 mb-2")}>
      <h2 className={cn(styles.number, "text text_type_digits-default mb-10")}>
        #{order.number}
      </h2>
      <OrderInfo order={order} />
    </section>
  );
}
