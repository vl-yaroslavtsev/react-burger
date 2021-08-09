import cn from "classnames";
import { useParams } from "react-router-dom";

import OrderInfo from "../components/order-info/order-info";
import Skeleton from "../components/skeleton/skeleton";
import { useOrderLoad } from "../services/orders";
import styles from "./order.module.css";

export function OrderPage() {
  const { id } = useParams<{ id: string }>();

  const { order, loading, error } = useOrderLoad(id);

  if (error) {
    return (
      <section
        className={cn(
          styles.container,
          "mt-2 mb-2 text text_type_main-default"
        )}
      >
        <p className={styles.error}>
          Не удалось найти заказ {id}.<br /> {error}
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className={cn(styles.container, "mt-2 mb-2")}>
        <div className={styles.center}>
          <Skeleton
            width={200}
            className={"text text_type_digits-default mb-10"}
          />
        </div>
        <Skeleton repeat={2} className="text text_type_main-medium mt-5" />
        <div className="mt-15">
          <Skeleton width={64} circle={true} className="mr-4" />
          <Skeleton width="60%" className="text text_type_main-default mt-6" />
        </div>
        <div className="mt-4">
          <Skeleton width={64} height={64} circle={true} className="mr-4" />
          <Skeleton width="60%" className="text text_type_main-default mt-6" />
        </div>
      </section>
    );
  }

  return (
    order && (
      <section className={cn(styles.container, "mt-2 mb-2")}>
        <h2
          className={cn(styles.center, "text text_type_digits-default mb-10")}
        >
          #{order.number}
        </h2>
        <OrderInfo order={order} />
      </section>
    )
  );
}
