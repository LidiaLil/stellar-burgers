import { TIngredient } from '@utils-types';
import ingredientsReducer, {
  IngredientsState,
  fetchIngredients
} from '../slices/ingredientsSlice';

// Моки данных ингредиентов
const ingredientsMock: TIngredient[] = [
  {
    _id: '1',
    name: 'Bun',
    type: 'bun',
    proteins: 50,
    fat: 20,
    carbohydrates: 30,
    calories: 100,
    price: 100,
    image: 'https://example.com/bun.png',
    image_mobile: 'https://example.com/bun-mobile.png',
    image_large: 'https://example.com/bun-large.png'
  },
  {
    _id: '2',
    name: 'Sauce',
    type: 'sauce',
    proteins: 30,
    fat: 15,
    carbohydrates: 25,
    calories: 80,
    price: 50,
    image: 'https://example.com/sauce.png',
    image_mobile: 'https://example.com/sauce-mobile.png',
    image_large: 'https://example.com/sauce-large.png'
  },
  {
    _id: '3',
    name: 'Main',
    type: 'main',
    proteins: 40,
    fat: 25,
    carbohydrates: 35,
    calories: 120,
    price: 75,
    image: 'https://example.com/main.png',
    image_mobile: 'https://example.com/main-mobile.png',
    image_large: 'https://example.com/main-large.png'
  }
];

// Начальное состояние ингредиентов из слайса
const initialState: IngredientsState = {
  isLoading: false,
  ingredients: [],
  error: null
};

describe('Тесты для ingredientsSlice', () => {
  test('Проверка начального состояния', () => {
    const state = ingredientsReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });

  test('тест обработки экшена ожидания получения ингредиентов', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест обработки экшена успешного получения ингредиентов', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: ingredientsMock
    };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      ingredients: ingredientsMock,
      error: null
    });
  });

  test('тест обработки экшена ошибки при получении ингредиентов', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка при загрузке ингредиентов' }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка при загрузке ингредиентов'
    });
  });
});
