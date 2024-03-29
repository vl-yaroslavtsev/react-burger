import cn from "classnames";
import {
  Input,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";

import { Link } from "react-router-dom";

import PasswordInput from "../components/password-input/password-input";
import { useFormSubmit } from "../services/form";
import { register as callRegister } from "../services/api";

import styles from "./register.module.css";

export function RegisterPage() {
  const { data, loading, error, register, handleSubmit } = useFormSubmit({
    onSubmit: (params) => callRegister(params),
  });

  if (data) {
    return (
      <form className={styles.container}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
        <p className="text text_type_main-default ">
          Вы успешно зарегистирированы. <Link to="/login">Войти</Link>
        </p>
      </form>
    );
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
      {error && (
        <p className={cn(styles.error, "text text_type_main-default mb-4")}>
          {error}
        </p>
      )}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Имя"
          {...register("name", { validate: { required: true, minLength: 3 } })}
          disabled={loading}
        />
      </div>
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
        <Button>Зарегистрироваться</Button>
      </div>
      <p className="text text_type_main-default text_color_inactive">
        Уже зарегистированы? <Link to="/login">Войти</Link>
      </p>
    </form>
  );
}
