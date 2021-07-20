import cn from "classnames";

import { useState, useEffect, useRef } from "react";

import { NavLink, Route, useRouteMatch } from "react-router-dom";

import ProfileForm from "../components/profile-form/profile-form";
import { useAuth } from "../services/auth";
import OrderItem from "../components/order-item/order-item";
import { ordersList } from "../services/data";

import styles from "./profile.module.css";
import { useScrollbar } from "../services/utils";

function Menu() {
  const { path } = useRouteMatch();
  return (
    <nav className={cn(styles.menu, "mt-20 mr-15")}>
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
          "text text_type_main-default text_color_inactive mt-20"
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
    <p className="text text_type_main-default mt-20">Выполняется выход...</p>
  );
}

function OrderList() {
  const orderListRef = useRef();
  useScrollbar(orderListRef);
  return (
    <ul className={styles.orderList} ref={orderListRef}>
      {ordersList.map((order) => (
        <li key={order.number} className="mb-6 mr-2">
          <OrderItem order={order} />
        </li>
      ))}
    </ul>
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
