import { getCookie, setCookie, deleteCookie } from "./utils";

const API_URL = "https://norma.nomoreparties.space/api";
export const routes = {
  ingredients: `${API_URL}/ingredients`,
  orders: `${API_URL}/orders`,
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    logout: `${API_URL}/auth/logout`,
    token: `${API_URL}/auth/token`,
    user: `${API_URL}/auth/user`,
  },
  password: {
    resetCheck: `${API_URL}/password-reset`,
    reset: `${API_URL}/password-reset/reset`,
  },
};

function translate(msg) {
  switch (msg) {
    case "email or password are incorrect":
      return "Введены неверные Email или пароль";
    case "Incorrect reset token":
      return "Неверный токен для сброса пароля";
    default:
      return msg;
  }
}

async function checkResponse(res) {
  let json;
  try {
    json = await res.json();
  } catch (ex) {}

  if (json && !json.success) {
    json.message = translate(json.message);
    throw json;
  }

  if (!res.ok) {
    throw new Error(`Статус: ${res.status}`);
  }

  return json;
}

async function fetchPost(url, params) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  return checkResponse(res);
}

function setTokens({ accessToken, refreshToken }) {
  if (accessToken) {
    accessToken = accessToken.split("Bearer ")[1];
    setCookie("accessToken", accessToken);
  }
  localStorage.setItem("refreshToken", refreshToken);
}

export async function refreshToken() {
  const data = await fetchPost(routes.auth.token, {
    token: localStorage.getItem("refreshToken"),
  });
  setTokens(data);
  return data;
}

async function fetchWithRefresh(url, { params = {}, method = "GET" } = {}) {
  try {
    let options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("accessToken"),
      },
    };
    if (method !== "GET") {
      options.body = JSON.stringify(params);
    }
    const res = await fetch(url, options);
    return await checkResponse(res);
  } catch (err) {
    if (err.message === "jwt expired") {
      await refreshToken();
      return fetchWithRefresh(url, { params, method });
    } else {
      throw err;
    }
  }
}

export async function loadIngredients() {
  const res = await fetch(routes.ingredients);
  const json = await checkResponse(res);
  return json.data;
}

export async function checkoutOrder(items = []) {
  return await fetchWithRefresh(routes.orders, {
    method: "POST",
    params: { ingredients: items },
  });
}

export async function login(params) {
  const data = await fetchPost(routes.auth.login, params);
  setTokens(data);
  return data;
}

export async function logout() {
  const data = await fetchPost(routes.auth.logout, {
    token: localStorage.getItem("refreshToken"),
  });
  deleteCookie("accessToken");
  localStorage.removeItem("refreshToken");
  return data;
}

export async function register(params) {
  return await fetchPost(routes.auth.register, params);
}

export async function checkResetPassword(params) {
  return await fetchPost(routes.password.resetCheck, params);
}

export async function resetPassword(params) {
  return await fetchPost(routes.password.reset, params);
}

export async function loadUser() {
  return await fetchWithRefresh(routes.auth.user);
}

export async function updateUser(params) {
  return await fetchWithRefresh(routes.auth.user, { method: "PATCH", params });
}

export async function loadOrderById(id) {
  const res = await fetch(`${routes.orders}/${id}`);
  const json = await checkResponse(res);
  return json.orders[0];
}
