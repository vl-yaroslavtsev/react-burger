import cn from "classnames";
import {
  Input,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";

import { Link, Redirect } from "react-router-dom";
import { useFormSubmit } from "../services/form";
import { checkResetPassword } from "../services/api";

import styles from "./forgot-password.module.css";

export function ForgotPasswordPage() {
  const { data, loading, error, register, values, handleSubmit } = useFormSubmit({
    onSubmit: checkResetPassword,
  });

  if (data) {
    return <Redirect to={{
      pathname: "/reset-password",
      state: { email: values.email }
    }} />;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      {error && (
        <p className={cn(styles.error, "text text_type_main-default mb-4")}>
          {error}
        </p>
      )}
      <div className="mb-6">
        <Input
          type="email"
          placeholder="Укажите e-mail"
          {...register("email", { validate: { required: true, email: true } })}
          disabled={loading}
        />
      </div>
      <div className="mb-20">
        <Button disabled={loading}>Восстановить</Button>
      </div>
      <p className="text text_type_main-default text_color_inactive">
        Вспомнили пароль? <Link to="/login">Войти</Link>
      </p>
    </form>
  );
}
