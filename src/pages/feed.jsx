import { useRef } from "react";
import cn from "classnames";
import { ordersList } from "../services/data";
import OrderItem from "../components/order-item/order-item";
import { useScrollbar } from "../services/utils";

import styles from "./feed.module.css";
import appStyles from "../components/app/app.module.css";

const completeOrders = [
  "034533",
  "034532",
  "034530",
  "034527",
  "034525"
];

const progressOrders = [
  "034538",
  "034541",
  "034542",
];

function StatisticGridItem({ title, orders, className, complete = false }) {
  return (
    <section className={cn(styles.statisticGridItem, className)}>
      <h2 className="text text_type_main-medium mb-6">{title}</h2>
      <ul className={cn("text text_type_digits-default", {
        [styles.success]: complete
      })}>{orders.map((order, index) => (
        <li className="mb-2" key={index}>{order}</li>
      ))}</ul>
    </section>
  );
}

export function FeedPage() {
  const statisticRef = useRef();
  const orderListRef = useRef();
  useScrollbar(statisticRef);
  useScrollbar(orderListRef);
  return (
    <section className={cn(styles.container, "mt-10")}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
      <section className={styles.content} >
        <ul className={cn(styles.orderList, "mr-15")}
          ref={orderListRef}>
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
              orders={completeOrders}
              complete={true} />
            <StatisticGridItem
              title="В работе:"
              orders={progressOrders} />
          </section>
          <h2 className="text text_type_main-medium mt-15">
            Выполнено за все время:
          </h2>
          <p className={cn(appStyles.textSpaceShadow, "text text_type_digits-large")}>
            28 752
          </p>
          <h2 className="text text_type_main-medium mt-15">
            Выполнено за сегодня:
          </h2>
          <p className={cn(appStyles.textSpaceShadow, "text text_type_digits-large")}>
            138
          </p>
        </section>
      </section>
    </section >
  );
}
