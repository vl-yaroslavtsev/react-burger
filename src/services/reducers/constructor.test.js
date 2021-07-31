import {
  ADD_CONSTRUCTOR_INGREDIENT,
  REMOVE_CONSTRUCTOR_INGREDIENT,
  REORDER_CONSTRUCTOR_INGREDIENTS,
  CLEAR_CONSTRUCTOR,
} from "../actions/constructor";

import { constructorReducer as reducer } from "./constructor.js";

describe("constructor reducer", () => {
  const initialState = {
    items: [],
    bunItem: null,
    totalPrice: 0,
  };

  const bunItem1 = {
    type: "bun",
    title: "Краторная булка R2-D3",
    price: 1200,
  };

  const bunItem2 = {
    type: "bun",
    title: "Спайси булка марсианская",
    price: 1800,
  };

  const stateItems = [
    {
      _id: "uio",
      key: "uio24523523455325",
      title: "Биокотлета",
      price: 1000,
    },
    {
      _id: "asd",
      key: "asd24523523455325",
      title: "Экзосалат",
      price: 1200,
    },
    {
      _id: "rty",
      key: "rty24523523455325",
      title: "Соус космический",
      price: 600,
    },
  ];

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should handle add bun item", () => {
    expect(
      reducer(initialState, {
        type: ADD_CONSTRUCTOR_INGREDIENT,
        item: bunItem1,
      })
    ).toEqual({
      items: [],
      bunItem: bunItem1,
      totalPrice: 2400,
    });
  });

  it("should handle replace bun item", () => {
    expect(
      reducer(
        {
          items: stateItems,
          bunItem: bunItem1,
          totalPrice: 5200,
        },
        {
          type: ADD_CONSTRUCTOR_INGREDIENT,
          item: bunItem2,
        }
      )
    ).toEqual({
      items: stateItems,
      bunItem: bunItem2,
      totalPrice: 6400,
    });
  });

  const newItem = {
    _id: "qwe",
    title: "Минеральные кольца",
    price: 600,
  };

  it("should handle add main item", () => {
    expect(
      reducer(
        {
          items: stateItems,
          bunItem: bunItem1,
          totalPrice: 5200,
        },
        {
          type: ADD_CONSTRUCTOR_INGREDIENT,
          item: newItem,
        }
      )
    ).toEqual({
      items: [
        ...stateItems,
        {
          ...newItem,
          key: expect.any(String),
        },
      ],
      bunItem: bunItem1,
      totalPrice: 5800,
    });
  });

  it("should handle remove main item", () => {
    expect(
      reducer(
        {
          items: stateItems,
          bunItem: bunItem1,
          totalPrice: 5200,
        },
        {
          type: REMOVE_CONSTRUCTOR_INGREDIENT,
          item: stateItems[0],
        }
      )
    ).toEqual({
      items: stateItems.slice(1),
      bunItem: bunItem1,
      totalPrice: 4200,
    });
  });

  it("should handle reorder main items", () => {
    expect(
      reducer(
        {
          items: stateItems,
          bunItem: bunItem1,
          totalPrice: 5200,
        },
        {
          type: REORDER_CONSTRUCTOR_INGREDIENTS,
          dropIndex: 0,
          hoverIndex: 2,
        }
      )
    ).toEqual({
      items: [stateItems[1], stateItems[2], stateItems[0]],
      bunItem: bunItem1,
      totalPrice: 5200,
    });
  });

  it("should handle clear counstructor", () => {
    expect(
      reducer(
        {
          items: stateItems,
          bunItem: bunItem1,
          totalPrice: 4000,
        },
        {
          type: CLEAR_CONSTRUCTOR,
        }
      )
    ).toEqual(initialState);
  });
});
