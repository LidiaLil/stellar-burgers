import { createSlice } from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TIngredient
} from '@utils-types';

// Функция для генерации уникального ID
const generateId = (): string => {
  // Проверяем, доступен ли crypto.randomUUID (работает в браузере)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback для тестовой среды или старых браузеров
  return (
    '_' +
    Math.random().toString(36).substr(2, 9) +
    Date.now().toString(36)
  );
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: {
    ingredients: [] as TConstructorIngredient[], // массив ингредиентов в конструкторе
    bun: null as TIngredient | null // булка в конструкторе
  },
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => {
        const idIngredient: TConstructorIngredient = {
          ...ingredient, // копируем все свойства ингредиента
          id: generateId() // добавляем уникальный id
        };
        return { payload: idIngredient };
      },
      reducer: (
        state,
        action: { payload: TConstructorIngredient }
      ) => {
        if (action.payload.type === 'bun') {
          // если тип ингредиента - булка
          state.bun = action.payload; // устанавливаем булку в состояние конструктора
        } else {
          state.ingredients.push(action.payload); // иначе добавляем ингредиент в массив ингредиентов
        }
      }
    },
    // удаление ингредиента по уникальному id
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        // фильтруем массив ингредиентов
        (ingredient) => ingredient.id !== action.payload // оставляем только те ингредиенты, id которых не совпадает с payload
      );
    },
    // перемещение ингредиента в массиве ингредиентов
    moveIngredient: (
      state, // состояние конструктора
      action: { payload: { from: number; to: number } } // payload с индексами перемещения
    ) => {
      const { from, to } = action.payload; //  извлекаем индексы из payload
      const ingredients = [...state.ingredients]; // создаем копию массива ингредиентов
      const [movedItem] = ingredients.splice(from, 1); // удаляем элемент из массива по индексу from
      ingredients.splice(to, 0, movedItem); // вставляем удаленный элемент на позицию to
      state.ingredients = ingredients; // обновляем состояние конструктора новым массивом ингредиентов
    },
    // очистка конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    constructorState: (state) => state
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;

export const { constructorState } =
  burgerConstructorSlice.selectors;

export type BurgerConstructorState = ReturnType<
  typeof burgerConstructorSlice.reducer
>;
