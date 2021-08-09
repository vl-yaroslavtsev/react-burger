export interface IIngredient {
  readonly _id: string;
  readonly name: string;
  readonly type: "bun" | "main" | "sauce";
  readonly image: string;
  readonly image_mobile: string;
  readonly image_large: string;
  readonly price: number;
  readonly calories: number;
  readonly carbohydrates: number;
  readonly fat: number;
  readonly proteins: number;
}

export interface IConstructorIngredient extends IIngredient {
  key: string;
}

export interface IOrderIngredient extends IIngredient {
  count: number;
}

export interface IOrder {
  readonly _id: string;
  readonly number: number;
  readonly name: string;
  readonly status: "created" | "pending" | "done" | "canceled";
  readonly ingredients: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface IFullOrder extends Omit<IOrder, "ingredients"> {
  readonly price: number;
  readonly ingredients: IOrderIngredient[];
}

export interface IUser {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
}
