import { useState } from "react";
import cn from "classnames";
import {
  Input,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";

import PasswordInput from "../components/password-input/password-input";
import { useFormSubmit } from "../services/form";

import styles from "./login.module.css";

export function LoginPage() {
  const {
    data,
    loading,
    error,
    values,
    validation,
    handleChange,
    handleSubmit,
  } = useFormSubmit({
    submitter: async (params) =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, ...params }), 3000);
      }),
    validation: {
      email: {
        required: true,
        email: true,
      },
      password: {
        minLength: 4,
      },
    },
    defValues: {
      email: "",
      password: "",
    },
  });
  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className="text text_type_main-medium mb-6">Вход</h1>
      {data && <p>Данные успешно получены {JSON.stringify(data)}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p style={{ color: "green" }}>Загрузка...</p>}
      <Input
        type="email"
        placeholder="E-mail"
        name="email"
        value={values.email}
        onChange={handleChange}
        disabled={loading}
        error={!!validation.email}
        errorText={validation.email}
      />
      <PasswordInput
        placeholder="Пароль"
        name="password"
        value={values.password}
        onChange={handleChange}
        disabled={loading}
        error={!!validation.password}
        errorText={validation.password}
      />

      <Button disabled={loading}>Войти</Button>
    </form>
  );
}
