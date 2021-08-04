import ingredients from "../fixtures/ingredients.json";

describe("Главная страница", () => {
  const $ctrBunTop = "[data-test-id='ctr-bun-top']";
  const $ctrBunBottom = "[data-test-id='ctr-bun-bottom']";
  const $ctrItems = "[data-test-id^='ctr-item-']";

  beforeEach(() => {
    cy.visit("/");
    cy.get("[data-test-id='constructor-container']").as("constructor");
  });

  it("Скелетон во время загрузки ингредиентов", () => {
    cy.contains("Соберите бургер");
    cy.get("[data-test-id='ingredients-skeleton']");
  });

  it("Перетаскивание булки в конструктор и замена булки в конструкторе", () => {
    cy.get($ctrBunTop).should("not.exist");
    cy.get($ctrBunBottom).should("not.exist");
    cy.get($ctrItems).should("not.exist");

    cy.get(`[data-test-id='ingredient-${ingredients.bun1.id}']`).trigger(
      "dragstart"
    );
    cy.get("@constructor").trigger("drop");

    cy.get($ctrBunTop).should("exist").and("contain", ingredients.bun1.name);
    cy.get($ctrBunBottom).should("exist").and("contain", ingredients.bun1.name);

    cy.get(`[data-test-id='ingredient-${ingredients.bun2.id}']`).trigger(
      "dragstart"
    );
    cy.get("@constructor").trigger("drop");

    cy.get($ctrBunTop).should("contain", ingredients.bun2.name);
    cy.get($ctrBunBottom).should("contain", ingredients.bun2.name);

    cy.get($ctrItems).should("not.exist");
  });

  it("Перетаскивание ингредиентов в конструктор", () => {
    cy.get($ctrBunTop).should("not.exist");
    cy.get($ctrItems).should("not.exist");
    cy.get($ctrBunBottom).should("not.exist");

    cy.get(`[data-test-id='ingredient-${ingredients.item1.id}']`).trigger(
      "dragstart"
    );
    cy.get("@constructor").trigger("drop");

    cy.get($ctrItems).should("exist");
    cy.get(`[data-test-id='ctr-item-${ingredients.item1.id}']`).should(
      "contain",
      ingredients.item1.name
    );

    cy.get(`[data-test-id='ingredient-${ingredients.item2.id}']`).trigger(
      "dragstart"
    );
    cy.get("@constructor").trigger("drop");

    cy.get($ctrItems).should("have.length", 2);
    cy.get(`[data-test-id='ctr-item-${ingredients.item2.id}']`).should(
      "contain",
      ingredients.item2.name
    );
    cy.get($ctrBunTop).should("not.exist");
    cy.get($ctrBunBottom).should("not.exist");
  });

  it("Сортировка ингредиентов перетаскиванием в конструкторе", () => {
    cy.get($ctrItems).should("not.exist");

    cy.get(`[data-test-id='ingredient-${ingredients.item1.id}']`).trigger(
      "dragstart"
    );
    cy.get("@constructor").trigger("drop");
    cy.get(`[data-test-id='ingredient-${ingredients.item2.id}']`).trigger(
      "dragstart"
    );
    cy.get("@constructor").trigger("drop");
    cy.get(`[data-test-id='ingredient-${ingredients.item3.id}']`).trigger(
      "dragstart"
    );
    cy.get("@constructor").trigger("drop");

    cy.get($ctrItems).should(($items) => {
      expect($items).to.have.length(3);

      const ids = $items
        .map((i, el) => el.dataset.testId.replace("ctr-item-", ""))
        .get();

      expect(ids).to.deep.eq([
        ingredients.item1.id,
        ingredients.item2.id,
        ingredients.item3.id,
      ]);
    });

    cy.get(`[data-test-id='ctr-item-${ingredients.item1.id}']`).trigger(
      "dragstart"
    );
    cy.get(`[data-test-id='ctr-item-${ingredients.item3.id}']`).trigger("drop");

    cy.get("@constructor")
      .find($ctrItems)
      .should(($items) => {
        const ids = $items
          .map((i, el) => el.dataset.testId.replace("ctr-item-", ""))
          .get();

        expect(ids).to.deep.eq([
          ingredients.item2.id,
          ingredients.item1.id,
          ingredients.item3.id,
        ]);
      });
  });
});
