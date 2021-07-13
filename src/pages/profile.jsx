import cn from "classnames";
import {
  Input,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";

import { useState, useEffect } from "react";

import { NavLink, Route } from "react-router-dom";

import PasswordInput from "../components/password-input/password-input";
import { useFormSubmit } from "../services/form";
import { useAuth } from "../services/auth";

import styles from "./profile.module.css";

function Menu() {
  return (
    <nav className={cn(styles.menu, "mt-20 mr-15")}>
      <ul className="text text_type_main-medium">
        <li className={styles.menuItem}>
          <NavLink to="/profile" exact activeClassName={styles.menuItemActive}>
            Профиль
          </NavLink>
        </li>
        <li className={styles.menuItem}>
          <NavLink to="/profile/orders" activeClassName={styles.menuItemActive}>
            История заказов
          </NavLink>
        </li>
        <li className={styles.menuItem}>
          <NavLink
            to="/profile/logout"
            exact
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

function ProfileForm() {
  const { data, loading, error, register, handleSubmit } = useFormSubmit({
    // onSubmit: signIn,
  });

  if (data) {
    //return <Redirect to={location.state?.from || "/"} />;
  }
  return (
    <form className={cn(styles.form, "mt-20")} onSubmit={handleSubmit}>
      {error && (
        <p className={cn(styles.error, "text text_type_main-default mb-4")}>
          {error}
        </p>
      )}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Имя"
          {...register("name", {
            validate: { required: true, minLength: 3 },
          })}
          disabled={loading}
        />
      </div>
      <div className="mb-6">
        <Input
          type="email"
          placeholder="Логин"
          {...register("email", {
            validate: { required: true, email: true },
          })}
          disabled={loading}
        />
      </div>
      <div className="mb-6">
        <PasswordInput
          placeholder="Пароль"
          {...register("password", { validate: { minLength: 6 } })}
          disabled={loading}
        />
      </div>
    </form>
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
        Список заказов...
      </Route>
      <Route path="/profile/logout" exact>
        <Logout />
      </Route>
    </section>
  );
}
