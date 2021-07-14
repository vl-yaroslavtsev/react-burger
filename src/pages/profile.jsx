import cn from "classnames";

import { useState, useEffect } from "react";

import { NavLink, Route } from "react-router-dom";

import ProfileForm from "../components/profile-form/profile-form";
import { useAuth } from "../services/auth";
import OrderItem from "../components/order-item/order-item";
import { ordersList } from "../services/data";

import styles from "./profile.module.css";

function Menu() {
  return (
    <nav className={cn(styles.menu, "mt-20 mr-15")}>
      <ul className="text text_type_main-medium">
        <li>
          <NavLink
            to="/profile"
            exact
            className={styles.menuItem}
            activeClassName={styles.menuItemActive}
          >
            Профиль
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile/orders"
            className={styles.menuItem}
            activeClassName={styles.menuItemActive}
          >
            История заказов
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile/logout"
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
        <Route path="/profile" exact>
          В этом разделе вы можете изменить свои персональные данные
        </Route>
        <Route path="/profile/orders" exact>
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
  }, []);

  return logoutError ? (
    <p className={cn(styles.error, "text text_type_main-default mt-20")}>
      При выходе возникла ошибка. Пожалуйста, попробуйте позже. {logoutError}
    </p>
  ) : (
    <p className="text text_type_main-default mt-20">Выполняется выход...</p>
  );
}

export function ProfilePage() {
  return (
    <section className={cn(styles.container, "mt-10")}>
      <Menu />
      <Route path="/profile" exact>
        <ProfileForm />
      </Route>
      <Route path="/profile/orders" exact>
        <ul className={styles.orderList}>
          {ordersList.map((order) => (
            <li key={order.number} className="mb-6 mr-2">
              <OrderItem order={order} />
            </li>
          ))}
        </ul>
      </Route>
      <Route path="/profile/logout" exact>
        <Logout />
      </Route>
    </section>
  );
}
