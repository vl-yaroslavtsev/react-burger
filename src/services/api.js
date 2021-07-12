const API_URL = "https://norma.nomoreparties.space/api";
const routes = {
  ingredients: `${API_URL}/ingredients`,
  orders: `${API_URL}/orders`,
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    logout: `${API_URL}/logout`,
    token: `${API_URL}/token`,
  },
  password: {
    resetCheck: `${API_URL}/password-reset`,
    reset: `${API_URL}/password-reset/reset`,
  },
};

class StatusError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function post(url, params) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  let json;
  try {
    json = await res.json();
  } catch (ex) {}

  if (!res.ok) {
    throw new StatusError(
      `Статус: ${res.status}. ${json?.message}`,
      res.status
    );
  }

  if (!json.success) {
    throw new Error(json.message);
  }

  return json;
}

export async function loadIngredients() {
  const res = await fetch(routes.ingredients);

  if (!res.ok) {
    throw new StatusError(`Статус: ${res.status}`, res.status);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(`${json.message}`);
  }

  return json.data;
}

export async function checkoutOrder(items = []) {
  return await post(routes.orders, { ingredients: items });
}

export async function login(params) {
  try {
    return await post(routes.auth.login, params);
  } catch (err) {
    if (err.status === 401) {
      throw new Error("Введены неверные Email или пароль.");
    }

    throw err;
  }
}

export async function register(params) {
  return await post(routes.auth.register, params);
}

export async function checkResetPassword(params) {
  return await post(routes.password.resetCheck, params);
}

export async function resetPassword(params) {
  return await post(routes.password.reset, params);
}
