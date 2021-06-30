const GET_INGREDIENTS_URL = "https://norma.nomoreparties.space/api/ingredients";
const CHECKOUT_ORDER_URL = "https://norma.nomoreparties.space/api/orders";

export async function loadIngredients() {
  const res = await fetch(GET_INGREDIENTS_URL);

  if (!res.ok) {
    throw new Error(`Статус ответа сервера: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(`${json.message}`);
  }

  return json.data;
}

export async function checkoutOrder(items = []) {
  const res = await fetch(CHECKOUT_ORDER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredients: items }),
  });

  if (!res.ok) {
    throw new Error(`Статус ответа сервера: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(`${json.message}`);
  }

  return json;
}
