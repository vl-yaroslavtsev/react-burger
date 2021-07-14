import cn from "classnames";
import {
  Input,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";

import { Link, Redirect, useLocation } from "react-router-dom";

import PasswordInput from "../components/password-input/password-input";
import { useFormSubmit } from "../services/form";
import { useAuth } from "../services/auth";

import styles from "./login.module.css";

export function LoginPage() {
  const { user, userLoaded, signIn } = useAuth();
  const location = useLocation();
  const { data, loading, error, register, handleSubmit } = useFormSubmit({
    onSubmit: signIn,
  });

  if (!userLoaded) {
    return null;
  }

  if (!loading && user) {
    return <Redirect to="/" />;
  }

  if (data) {
    return <Redirect to={location.state?.from || "/"} />;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className="text text_type_main-medium mb-6">Вход</h1>
      {error && (
        <p className={cn(styles.error, "text text_type_main-default mb-4")}>
          {error}
        </p>
      )}
      <div className="mb-6">
        <Input
          type="email"
          placeholder="E-mail"
          {...register("email", { validate: { required: true, email: true } })}
          disabled={loading}
        />
      </div>
      <div className="mb-6">
        <PasswordInput
          placeholder="Пароль"
          {...register("password", {
            validate: { required: true, minLength: 6 },
          })}
          disabled={loading}
        />
      </div>
      <div className="mb-20">
        <Button disabled={loading}>Войти</Button>
      </div>
      <p className="text text_type_main-default text_color_inactive mb-4">
        Вы новый пользователь? <Link to="/register">Зарегистрироваться</Link>
      </p>
      <p className="text text_type_main-default text_color_inactive">
        Забыли пароль? <Link to="/forgot-password">Восстановить пароль</Link>
      </p>
    </form>
  );
}
