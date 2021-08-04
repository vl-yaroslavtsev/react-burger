import order from "../fixtures/order.json";
import ingredient from "../fixtures/ingredient.json";

describe("Доступность страниц для незарегистрированного пользователя", () => {
  it("Главная страница, на которой грузятся ингредиенты", () => {
    cy.visit("/");
    cy.contains("Соберите бургер");
    cy.contains(ingredient.name);
    cy.contains(ingredient.price);
  });

  it("Детальная страница ингредиента с данными", () => {
    cy.visit(`/ingredients/${ingredient.id}`);
    cy.contains("Детали ингредиента");
    cy.contains(ingredient.name);
  });

  it("Лента заказов", () => {
    cy.visit("/feed", { timeout: 7000 });
    cy.contains("Готовы:");
    cy.contains("В работе:");
    cy.contains("Выполнено за все время:");
    cy.contains("Выполнено за сегодня:");
  });

  it("Детальная страница заказа с данными", () => {
    cy.visit(`/feed/${order.id}`);
    cy.contains(order.id);
    cy.contains(order.name);
    cy.contains(order.price);
  });

  it("Страница входа", () => {
    cy.visit("/login");
    cy.contains("Вход");
  });

  it("Страница регистрации", () => {
    cy.visit("/register");
    cy.contains("Регистрация");
  });

  it("Страница восстановления пароля", () => {
    cy.visit("/forgot-password");
    cy.contains("Восстановление пароля");
  });

  it("Страница сброса пароля. Редирект на восстановление пароля", () => {
    cy.visit("/reset-password");
    cy.url().should("include", "/forgot-password");
  });

  it("Страница профиля. Редирект на вход", () => {
    cy.visit("/profile");
    cy.url().should("include", "/login");
  });

  it("Страница заказов в профиле. Редирект на вход", () => {
    cy.visit("/profile/orders/");
    cy.url().should("include", "/login");
  });

  it("Детальная страница заказа в профиле. Редирект на вход", () => {
    cy.visit("/profile/orders/1308");
    cy.url().should("include", "/login");
  });

  it("Выход из профиля. Редирект на вход", () => {
    cy.visit("/profile/logout");
    cy.url().should("include", "/login");
  });

  it("Несуществующая страница", () => {
    cy.visit("/asdfsdfasdfdsaf");
    cy.contains("404");
    cy.contains("Упс!");
  });
});
