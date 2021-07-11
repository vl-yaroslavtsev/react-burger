import { useState } from "react";

const emailRegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Правила валидации
const validationRules = {
  required: ({ value, message = "Введите значение" }) => {
    return value && value.length > 0 ? "" : message;
  },
  email: ({ value, message = "Введите корректный email" }) => {
    return emailRegExp.test(String(value).toLowerCase()) ? "" : message;
  },
  minLength: ({ value, param, message }) => {
    message = message || `Введите не менее ${param} символов`;
    return value && value.length > param ? "" : message;
  },
};

/**
 * Проверка значения в соответствии с правилами
 * @param {*} value значение
 * @param {*} rules правила
 * @returns Первое сообщение об ошибке или "", если без ошибок
 */
function validate(value, rules) {
  if (!rules) return "";

  const messages = Object.entries(rules).map(([ruleName, ruleParam]) => {
    if (!ruleParam) return "";
    return validationRules[ruleName]({
      value,
      param: typeof ruleParam === "object" ? ruleParam.param : ruleParam,
      ...(typeof ruleParam === "object" ? { message: ruleParam.message } : {}),
    });
  });

  return messages.filter((message) => !!message)[0] || "";
}

/**
 * Проверка всех значени в values в соотвествии с правилами rules
 * @param {Object} values
 * @param {Object} rules
 * @returns объект: ключ имя поля, значение - первое сообщение об ошибке
 */
function validateAll(values, rules) {
  let errors = {};
  for (const name of Object.keys(values)) {
    errors[name] = validate(values[name], rules[name]);
  }

  return errors;
}

/**
 * Хук управляет отправкой данных формы,
 * проверяет клиентскую валидацию с помощью правил validation,
 * устанавливает значения полей по умолчанию defValues
 * @param {(values) => Promise} submitter Отправщик данных формы
 * @param {Object} validation Правила валидации
 * @param {Object} defValues Значения полей по умолчанию
 * @return {{
 *   handleSubmit, обрабочик формы onSubmit
 *   data,         данные с сервера после отправки формы
 *   error,        ошибка с сервера после отправки формы
 *   loading,      загрузка данных после отправки формы
 *   handleChange, обрабтчик изменения поля формы
 *   values,       значения полей формы
 *   validation,   сообщения об ошибках клиентской валидации полей формы
 * }}
 */
export function useFormSubmit({
  submitter,
  validation: rules = {},
  defValues = {},
}) {
  const [values, setValues] = useState(defValues);
  const [validation, setValidation] = useState({});
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({
      ...values,
      [name]: value,
    });

    setValidation({
      ...validation,
      [name]: validate(value, rules[name]),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateAll(values, rules);
    setValidation(errors);
    // Есть ошибки клиентской валидации
    if (Object.values(errors).some((error) => error)) {
      return;
    }

    setData(null);
    setError("");
    setLoading(true);

    try {
      const res = await submitter(values);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    data,
    error,
    loading,
    handleChange,
    values,
    validation,
  };
}
