// Тип ингредиента
export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

// Тип ингредиента в конструкторе с уникальным id
export type TConstructorIngredient = TIngredient & {
  id: string;
};

// Тип заказа
export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

// Тип данных публичного списка заказов
export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

// Тип пользователя
export type TUser = {
  email: string;
  name: string;
};

// Тип режима вкладок ингредиентов
export type TTabMode = 'bun' | 'sauce' | 'main';
