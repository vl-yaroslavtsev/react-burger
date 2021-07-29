import { useRef } from "react";
import cn from "classnames";


import OrderItem from "../components/order-item/order-item";
import Skeleton from "../components/skeleton/skeleton";
import { useScrollbar } from "../services/utils";
import { useFeedOrders } from "../services/orders";

import styles from "./feed.module.css";
import appStyles from "../components/app/app.module.css";

function StatisticGridItem({ title, orders, loading, className, complete = false }) {
  return (
    <section className={cn(styles.statisticGridItem, className)}>
      <h2 className="text text_type_main-medium mb-6">{title}</h2>
      <ul className={cn(styles.statisticGridItemList, "text text_type_digits-default", {
        [styles.success]: complete
      })}>
        {loading && <Skeleton repeat={3} className="mb-2" tag="li" />}
        {orders.map((order, index) => (
          <li className="mb-2" key={index}>{order}</li>
        ))}
      </ul>
    </section>
  );
}

export function FeedPage() {
  const statisticRef = useRef();
  const orderListRef = useRef();
  useScrollbar(statisticRef);
  useScrollbar(orderListRef);

  const { ordersList, completeNumbers, progressNumbers,
    total, totalToday, error, loading } = useFeedOrders();

  return (
    <section className={cn(styles.container, "mt-10")}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
      <section className={styles.content} >
        {error && <p className={cn(styles.error, "text text_type_main-default")}>
          Что-то пошло не так. {error}</p>}
        <ul className={cn(styles.orderList, "mr-15")}
          ref={orderListRef}>
          {loading && <Skeleton className={cn(styles.skeletonOrder, "mb-4 mr-2")} repeat={2} tag="li" />}
          {ordersList.map(order => (
            <li className="mb-4 mr-2"
              key={order.number}><OrderItem order={order} /></li>
          ))}
        </ul>
        <section className={styles.statistic} ref={statisticRef}>
          <section className={styles.statisticGrid}>
            <StatisticGridItem
              className="mr-9"
              title="Готовы:"
              loading={loading}
              orders={completeNumbers}
              complete={true} />
            <StatisticGridItem
              title="В работе:"
              loading={loading}
              orders={progressNumbers} />
          </section>
          {total > 0 && (
            <>
              <h2 className="text text_type_main-medium mt-15">
                Выполнено за все время:
              </h2>
              <p className={cn(appStyles.textSpaceShadow, "text text_type_digits-large")}>
                {total}
              </p>
              <h2 className="text text_type_main-medium mt-15">
                Выполнено за сегодня:
              </h2>
              <p className={cn(appStyles.textSpaceShadow, "text text_type_digits-large")}>
                {totalToday}
              </p>
            </>
          )}
        </section>
      </section>
    </section >
  );
}
