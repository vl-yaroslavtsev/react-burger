import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";

const emailRegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type TValidationRuleNames = "required" | "email" | "minLength";

interface IValidationRuleParams<TParam = any> {
  value: string;
  param?: TParam;
  message?: string;
}

type TValidationRules = {
  [key in TValidationRuleNames]: (params: IValidationRuleParams) => string;
};

type TValidationRuleValue =
  | boolean
  | number
  | {
      param: boolean | number;
      message?: string;
    };

type TValidationRuleValues = {
  [key in TValidationRuleNames]?: TValidationRuleValue;
};

// Правила валидации
const validationRules: TValidationRules = {
  required: ({ value, message = "Введите значение" }) => {
    return value && value.length > 0 ? "" : message;
  },
  email: ({ value, message = "Введите корректный email" }) => {
    return emailRegExp.test(String(value).toLowerCase()) ? "" : message;
  },
  minLength: ({ value, param = 0, message }: IValidationRuleParams<number>) => {
    message = message || `Введите не менее ${param} символов`;
    return value.length >= param || value.length === 0 ? "" : message;
  },
};

/**
 * Проверка значения в соответствии с правилами
 * @param value значение
 * @param rules правила
 * @returns Первое сообщение об ошибке или "", если без ошибок
 */
function validate(value: string, rules: TValidationRuleValues): string {
  if (!rules) return "";

  const messages = Object.entries(rules).map(([ruleName, ruleParam]) => {
    if (!ruleParam) return "";
    return validationRules[ruleName as TValidationRuleNames]({
      value,
      param: typeof ruleParam === "object" ? ruleParam.param : ruleParam,
      ...(typeof ruleParam === "object" ? { message: ruleParam.message } : {}),
    });
  });

  return messages.filter((message) => !!message)[0] || "";
}

/**
 * Проверка всех значени в values в соотвествии с правилами rules
 * @param values
 * @param rules
 * @returns объект: ключ имя поля, значение - первое сообщение об ошибке
 */
function validateAll(
  values: { [name: string]: string },
  rules: { [name: string]: TValidationRuleValues }
) {
  const errors: { [name: string]: string } = {};
  for (const name of Object.keys(values)) {
    errors[name] = validate(values[name], rules[name]);
  }

  return errors;
}

/**
 * Хук управляет отправкой данных формы,
 * проверяет клиентскую валидацию с помощью правил validation,
 * устанавливает значения полей по умолчанию defValues
 * @param {(values) => Promise} onSubmit Отправщик данных формы
 * @return {{
 *   handleSubmit, обрабочик формы onSubmit
 *   data,         данные с сервера после отправки формы
 *   error,        ошибка с сервера после отправки формы
 *   loading,      загрузка данных после отправки формы
 *   register,     обрабтчик изменения поля формы
 * }}
 */
export function useFormSubmit<IData>({
  onSubmit,
}: {
  onSubmit: (param: any) => Promise<IData>;
}) {
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [validation, setValidation] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState<IData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const prevDataRef = useRef<IData | null>(null);
  const rulesRef = useRef<{ [name: string]: TValidationRuleValues }>({});

  useEffect(() => {
    prevDataRef.current = data;
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    const rules = rulesRef.current;

    setValues({
      ...values,
      [name]: value,
    });

    setValidation({
      ...validation,
      [name]: validate(value, rules[name]),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const rules = rulesRef.current;

    if (loading) return;

    const errors = validateAll(values, rules);
    setValidation(errors);
    // Есть ошибки клиентской валидации
    if (Object.values(errors).some((error) => error)) {
      return;
    }

    setData(null);
    setLoading(true);

    try {
      const res = await onSubmit(values);
      setError("");
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = (
    name: string,
    {
      value = "",
      validate,
    }: {
      value?: string;
      validate?: TValidationRuleValues;
    } = {}
  ) => {
    if (!(name in values)) {
      setValues({
        ...values,
        [name]: value,
      });
    }

    if (validate && !(name in rulesRef.current)) {
      rulesRef.current[name] = validate;
    }

    return {
      name,
      value: values[name] || "",
      onChange: handleChange,
      error: !!validation[name],
      errorText: validation[name],
    };
  };

  return {
    handleSubmit,
    data,
    dataChanged: data !== prevDataRef.current,
    error,
    loading,
    values,
    setValues,
    register,
  };
}
