const GET_INGREDIENTS_URL = "https://norma.nomoreparties.space/api/ingredients";
const CHECKOUT_ORDER_URL = "https://norma.nomoreparties.space/api/orders";

export async function loadIngredients() {
  try {
    const res = await fetch(GET_INGREDIENTS_URL);

    if (!res.ok) {
      throw new Error(`Статус ответа сервера: ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) {
      throw new Error(`${json.message}`);
    }

    return json.data;
  } catch (err) {
    throw new Error(
      `Что-то пошло не так. Попробуйте зайти еще раз позже.\n${err.message}`
    );
  }
}

export async function checkoutOrder(items = []) {
  try {
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
  } catch (err) {
    throw new Error(
      `Что-то пошло не так. Попробуйте оформить заказ позже.\n${err.message}`
    );
  }
}
