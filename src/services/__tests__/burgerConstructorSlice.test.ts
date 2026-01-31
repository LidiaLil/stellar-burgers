import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../slices/burgerConstructorSlice';
import type {
  TIngredient,
  TConstructorIngredient
} from '@utils-types';
import type { BurgerConstructorState } from '../slices/burgerConstructorSlice';

// Моки ингредиентов для тестов
const bunMock = {
  _id: 'mock-bun-id',
  name: 'Mock Bun',
  type: 'bun' as const,
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 200,
  image: 'mock-bun-image-url',
  image_mobile: 'mock-bun-image-mobile-url',
  image_large: 'mock-bun-image-large-url'
};

const mainMock = {
  _id: 'mock-main-id',
  name: 'Mock Main',
  type: 'main' as const,
  proteins: 15,
  fat: 10,
  carbohydrates: 25,
  calories: 150,
  price: 300,
  image: 'mock-main-image-url',
  image_mobile: 'mock-main-image-mobile-url',
  image_large: 'mock-main-image-large-url'
};

const sauceMock = {
  _id: 'mock-sauce-id',
  name: 'Mock Sauce',
  type: 'sauce' as const,
  proteins: 5,
  fat: 2,
  carbohydrates: 10,
  calories: 50,
  price: 100,
  image: 'mock-sauce-image-url',
  image_mobile: 'mock-sauce-image-mobile-url',
  image_large: 'mock-sauce-image-large-url'
};

// Начальное состояние с правильным типом
const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

describe('Написаны тесты, проверяющие работу редьюсера конструктора бургера при обработке экшенов добавления и удаления ингредиента.', () => {
  test('Проверка начального состояния', () => {
    const state = burgerConstructorReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });

  test('Добавление ингредиентов', () => {
    // Подготавливаем все экшены заранее
    const addBunAction = addIngredient(bunMock);
    const addMainAction = addIngredient(mainMock);
    const addSauceAction = addIngredient(sauceMock);

    let state: BurgerConstructorState = initialState;

    // 1. Добавляем булку
    state = burgerConstructorReducer(state, addBunAction);

    // Проверяем, что булка добавилась с уникальным id
    expect(state.bun).toMatchObject({
      ...bunMock,
      id: expect.any(String)
    });
    expect(state.ingredients).toEqual([]);

    // 2. Добавляем котлету
    state = burgerConstructorReducer(state, addMainAction);

    expect(state.bun).toMatchObject({
      ...bunMock,
      id: expect.any(String)
    });
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      ...mainMock,
      id: expect.any(String)
    });

    // 3. Добавляем соус
    state = burgerConstructorReducer(state, addSauceAction);

    expect(state.bun).toMatchObject({
      ...bunMock,
      id: expect.any(String)
    });
    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toMatchObject({
      ...mainMock,
      id: expect.any(String)
    });
    expect(state.ingredients[1]).toMatchObject({
      ...sauceMock,
      id: expect.any(String)
    });
  });

  test('Удаление ингредиента', () => {
    // Подготавливаем экшены
    const addMainAction = addIngredient(mainMock);
    const addSauceAction = addIngredient(sauceMock);

    let state: BurgerConstructorState = initialState;

    // Добавляем несколько ингредиентов
    state = burgerConstructorReducer(state, addMainAction);
    state = burgerConstructorReducer(state, addSauceAction);

    const ingredientToRemoveId = state.ingredients[0].id;
    const removeAction = removeIngredient(
      ingredientToRemoveId
    );

    // Удаляем первый ингредиент
    state = burgerConstructorReducer(state, removeAction);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(sauceMock._id);
  });

  test('Перемещение ингредиента', () => {
    // Подготавливаем экшены
    const addMainAction = addIngredient(mainMock);
    const addSauceAction = addIngredient(sauceMock);

    let state: BurgerConstructorState = initialState;

    // Добавляем ингредиенты: сначала котлету, потом соус
    state = burgerConstructorReducer(state, addMainAction);
    state = burgerConstructorReducer(state, addSauceAction);

    // Проверяем начальный порядок: [котлета, соус]
    expect(state.ingredients[0]._id).toBe('mock-main-id');
    expect(state.ingredients[1]._id).toBe('mock-sauce-id');

    // Создаем экшен перемещения
    const moveAction = moveIngredient({ from: 1, to: 0 });

    // Перемещаем соус на позицию котлеты (меняем их местами)
    state = burgerConstructorReducer(state, moveAction);

    // Проверяем новый порядок: [соус, котлета]
    expect(state.ingredients[0]._id).toBe('mock-sauce-id');
    expect(state.ingredients[1]._id).toBe('mock-main-id');
  });

  test('Очистка конструктора', () => {
    // Подготавливаем экшены
    const addBunAction = addIngredient(bunMock);
    const addMainAction = addIngredient(mainMock);
    const addSauceAction = addIngredient(sauceMock);
    const clearAction = clearConstructor();

    let state: BurgerConstructorState = initialState;

    // Добавляем булку и ингредиенты
    state = burgerConstructorReducer(state, addBunAction);
    state = burgerConstructorReducer(state, addMainAction);
    state = burgerConstructorReducer(state, addSauceAction);

    // Очищаем конструктор
    state = burgerConstructorReducer(state, clearAction);

    expect(state).toEqual(initialState);
  });
});
