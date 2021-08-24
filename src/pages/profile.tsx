import cn from "classnames";

import { useState, useEffect, useRef } from "react";

import { NavLink, Route, useRouteMatch } from "react-router-dom";

import ProfileForm from "../components/profile-form/profile-form";
import { useAuth } from "../services/auth";
import OrderItem from "../components/order-item/order-item";
import Skeleton from "../components/skeleton/skeleton";
import Spinner from "../components/spinner/spinner";

import { useProfileOrders } from "../services/orders";

import styles from "./profile.module.css";
import { useScrollbar } from "../services/scrollbar";

function Menu() {
  const { path } = useRouteMatch();
  return (
    <nav className={cn(styles.menu)}>
      <ul className="text text_type_main-medium">
        <li>
          <NavLink
            to={path}
            exact
            className={styles.menuItem}
            activeClassName={styles.menuItemActive}
          >
            Профиль
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`${path}/orders`}
            className={styles.menuItem}
            activeClassName={styles.menuItemActive}
          >
            История заказов
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`${path}/logout`}
            exact
            className={styles.menuItem}
            activeClassName={styles.menuItemActive}
          >
            Выход
          </NavLink>
        </li>
      </ul>
      <footer
        className={cn(
          styles.menuFooter,
          "text text_type_main-default text_color_inactive"
        )}
      >
        <Route path={path} exact>
          В этом разделе вы можете изменить свои персональные данные
        </Route>
        <Route path={`${path}/orders`} exact>
          В этом разделе вы можете просмотреть свою историю заказов
        </Route>
      </footer>
    </nav>
  );
}

function Logout() {
  const { signOut } = useAuth();
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    signOut().catch((err) => setLogoutError(err.message));
  }, [signOut]);

  return logoutError ? (
    <p className={cn(styles.error, "text text_type_main-default mt-20")}>
      При выходе возникла ошибка. Пожалуйста, попробуйте позже. {logoutError}
    </p>
  ) : (
    <Spinner center={true} />
  );
}

function OrderList() {
  const orderListRef = useRef<HTMLUListElement>(null);
  useScrollbar(orderListRef);

  const { ordersList, error, loading } = useProfileOrders();

  return (
    <>
      {error && (
        <p className={cn(styles.error, "text text_type_main-default")}>
          Что-то пошло не так. {error}
        </p>
      )}
      <ul className={styles.orderList} ref={orderListRef}>
        {loading && (
          <Skeleton
            repeat={2}
            className={cn(styles.skeletonOrder, "mb-6 mr-2")}
            tag="li"
          />
        )}
        {ordersList.map((order) => (
          <li key={order.number} className="mb-6 mr-2">
            <OrderItem order={order} />
          </li>
        ))}
      </ul>
    </>
  );
}

export function ProfilePage() {
  const { path } = useRouteMatch();
  return (
    <section className={cn(styles.container, "mt-10")}>
      <Menu />
      <Route path={path} exact>
        <ProfileForm />
      </Route>
      <Route path={`${path}/orders`} exact>
        <OrderList />
      </Route>
      <Route path={`${path}/logout`} exact>
        <Logout />
      </Route>
    </section>
  );
}
