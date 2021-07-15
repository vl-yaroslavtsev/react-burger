import cn from "classnames";
import { useParams } from "react-router-dom";

import { ordersList } from "../services/data";

import styles from "./feed.module.css";

export function FeedPage() {
  return (
    <section className={cn(styles.container, "mt-10")}>Лента заказов</section>
  );
}
