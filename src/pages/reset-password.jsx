import cn from "classnames";
import {
  Input,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";

import PasswordInput from "../components/password-input/password-input";
import { Link, Redirect, useLocation } from "react-router-dom";
import { useFormSubmit } from "../services/form";
import { resetPassword } from "../services/api";

import styles from "./reset-password.module.css";

export function ResetPasswordPage() {
  const location = useLocation();
  const { data, loading, error, register, handleSubmit } = useFormSubmit({
    onSubmit: resetPassword,
  });

  if (!location.state?.email) {
    return <Redirect to="/forgot-password" />;
  }

  if (data) {
    return (
      <form className={styles.container}>
        <h1 className="text text_type_main-medium mb-6">
          Восстановление пароля
        </h1>
        <p className="text text_type_main-default ">
          Пароль успешно изменён. <Link to="/login">Войти</Link>
        </p>
      </form>
    );
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      {data && <p>Данные успешно получены {JSON.stringify(data)}</p>}
      {error && (
        <p className={cn(styles.error, "text text_type_main-default mb-4")}>
          {error}
        </p>
      )}
      <div className="mb-6">
        <PasswordInput
          placeholder="Введите новый пароль"
          {...register("password", {
            validate: { required: true, minLength: 6 },
          })}
          disabled={loading}
        />
      </div>
      <div className="mb-6">
        <Input
          type="input"
          placeholder="Введите код из письма"
          {...register("token", {
            validate: { required: true, minLength: 10 },
          })}
          disabled={loading}
        />
      </div>
      <div className="mb-20">
        <Button disabled={loading}>Сохранить</Button>
      </div>
      <p className="text text_type_main-default text_color_inactive">
        Вспомнили пароль? <Link to="/login">Войти</Link>
      </p>
    </form>
  );
}
