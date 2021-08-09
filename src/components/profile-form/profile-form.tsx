import cn from "classnames";
import { Button } from "@ya.praktikum/react-developer-burger-ui-components";
import { useDispatch } from "react-redux";

import ViewInput from "../view-input/view-input";
import { useFormSubmit } from "../../services/form";
import { useAuth } from "../../services/auth";
import { updateUser } from "../../services/api";
import { isEqual } from "../../services/utils";

import { SET_USER } from "../../services/actions/user";

import styles from "./profile-form.module.css";

export default function ProfileForm() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const {
    data,
    dataChanged,
    loading,
    error,
    register,
    values,
    setValues,
    handleSubmit,
  } = useFormSubmit({
    onSubmit: updateUser,
  });

  if (!user) {
    return null;
  }

  const footerVisible = !isEqual({ ...user, password: "" }, values);

  const createSetValue = (name: string) => {
    return (value: string) => setValues({ ...values, [name]: value });
  };

  const handleCancel = () => {
    setValues({ ...user, password: "" });
  };

  if (
    data &&
    dataChanged &&
    !isEqual(values, {
      ...data.user,
      password: "",
    })
  ) {
    setValues({
      ...data.user,
      password: "",
    });
  }

  if (data && user !== data.user) {
    dispatch({ type: SET_USER, user: data.user });
  }

  return (
    <form className={cn(styles.form, "mt-20")} onSubmit={handleSubmit}>
      {error && (
        <p className={cn(styles.error, "text text_type_main-default mb-4")}>
          {error}
        </p>
      )}
      <div className="mb-6">
        <ViewInput
          type="text"
          placeholder="Имя"
          setValue={createSetValue("name")}
          {...register("name", {
            value: user.name,
            validate: { required: true, minLength: 3 },
          })}
          disabled={loading}
        />
      </div>
      <div className="mb-6">
        <ViewInput
          type="email"
          placeholder="Логин"
          setValue={createSetValue("email")}
          {...register("email", {
            value: user.email,
            validate: { required: true, email: true },
          })}
          disabled={loading}
        />
      </div>
      <div className="mb-6">
        <ViewInput
          placeholder="Пароль"
          type="password"
          setValue={createSetValue("password")}
          {...register("password", { validate: { minLength: 6 } })}
          disabled={loading}
        />
      </div>
      <footer
        style={{ display: footerVisible ? "" : "none" }}
        className={styles.formFooter}
      >
        <a
          className="text text_type_main-default mr-7"
          onClick={loading ? undefined : handleCancel}
        >
          Отмена
        </a>
        <Button type="primary" size="medium">
          Сохранить
        </Button>
      </footer>
    </form>
  );
}
