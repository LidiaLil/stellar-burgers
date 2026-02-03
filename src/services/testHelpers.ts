import { TIngredient } from '@utils-types';
//Если нужно часто использовать mock-данные в разных тестах,
// можно создать helper-функцию
// Функция для создания mock-ингредиента с возможностью переопределения полей
export const createMockIngredient = (
  overrides?: Partial<TIngredient>
): TIngredient => ({
  _id: '1',
  name: 'Test Ingredient',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 200,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg',
  ...overrides
});

// готовые mock-объекты
//mock-объект должен соответствовать полному типу TIngredient,
// включая все обязательные поля, которые определены в @utils-types
export const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Bun',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 200,
    image: 'bun.jpg',
    image_mobile: 'bun-mobile.jpg',
    image_large: 'bun-large.jpg'
  },
  {
    _id: '2',
    name: 'Sauce',
    type: 'sauce',
    proteins: 5,
    fat: 3,
    carbohydrates: 10,
    calories: 50,
    price: 100,
    image: 'sauce.jpg',
    image_mobile: 'sauce-mobile.jpg',
    image_large: 'sauce-large.jpg'
  }
];
