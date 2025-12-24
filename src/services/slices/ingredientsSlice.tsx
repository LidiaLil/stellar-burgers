import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Определение типа состояния ингредиентов
export interface IngredientsState {
  isLoading: boolean; // Идет ли загрузка
  ingredients: TIngredient[]; // Массив ингредиентов
  error: string | null; // Ошибка при загрузке
}

// Начальное состояние ингредиентов
const initialState: IngredientsState = {
  isLoading: false, // Загрузка не идет по умолчанию
  ingredients: [], // Пустой массив ингредиентов по умолчанию
  error: null // Ошибок нет по умолчанию
};

// Асинхронный экшен для получения ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch', // Префикс для экшенов
  async () => {
    const response = await getIngredientsApi(); // Запрос к /api/ingredients
    return response; // Это станет action.payload в fulfilled
  }
);

// Слайс для управления состоянием ингредиентов
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка состояния ожидания получения ингредиентов
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка успешного получения ингредиентов
      .addCase(
        fetchIngredients.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.ingredients = action.payload;
        }
      )
      // Обработка ошибки при получении ингредиентов
      .addCase(
        fetchIngredients.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error.message ||
            'Ошибка при загрузке ингредиентов';
        }
      );
  },
  selectors: {
    selectIngredientsState: (state) => state, // Получение всего состояния ингредиентов
    selectIngredients: (state) => state.ingredients, // Получение массива ингредиентов
    selectIsLoading: (state) => state.isLoading, // Получение статуса загрузки
    selectError: (state) => state.error // Получение ошибки ингредиентов
  }
});

export default ingredientsSlice.reducer;
export const {
  selectIngredientsState,
  selectIngredients,
  selectIsLoading,
  selectError
} = ingredientsSlice.selectors;

export const getIngredientsByType = createSelector(
  [selectIngredients],
  (ingredients) => {
    // Выполняется 1 РАЗ при изменении ingredients
    const buns = ingredients.filter(
      (item) => item.type === 'bun'
    );
    const mains = ingredients.filter(
      (item) => item.type === 'main'
    );
    const sauces = ingredients.filter(
      (item) => item.type === 'sauce'
    );
    return { buns, mains, sauces };
  }
);
