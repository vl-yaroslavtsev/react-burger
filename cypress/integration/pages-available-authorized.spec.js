import user from "../fixtures/user.json";
import order from "../fixtures/order.json";
import { login } from "../../src/services/api";

describe("Доступность страниц для зарегистрированного пользователя", () => {
  beforeEach(() => {
    cy.wrap(login(user));
  });

  it("Страница входа. Редирект на главную", () => {
    cy.visit("/login");
    cy.url().should("equal", Cypress.config().baseUrl);
  });

  it("Страница регистрации. Редирект на главную", () => {
    cy.visit("/register");
    cy.url().should("equal", Cypress.config().baseUrl);
  });

  it("Страница восстановления пароля. Редирект на главную", () => {
    cy.visit("/forgot-password");
    cy.url().should("equal", Cypress.config().baseUrl);
  });

  it("Страница сброса пароля. Редирект на главную", () => {
    cy.visit("/reset-password");
    cy.url().should("equal", Cypress.config().baseUrl);
  });

  it("Страница профиля", () => {
    cy.visit("/profile");
    cy.contains("Имя");
    cy.get('input[name="name"]').should("have.value", user.name);
    cy.get('input[name="email"]').should("have.value", user.email);
  });

  it("Страница заказов в профиле", () => {
    cy.visit("/profile/orders/");
    cy.contains(order.id);
    cy.contains(order.name);
    cy.contains(order.price);
  });

  it("Детальная страница заказа в профиле", () => {
    cy.visit(`/profile/orders/${order.id}`);
    cy.contains(order.id);
    cy.contains(order.name);
    cy.contains(order.price);
  });

  it("Выход из профиля. Редирект на вход", () => {
    cy.visit("/profile/logout");
    cy.url().should("include", "/login");
  });
});
