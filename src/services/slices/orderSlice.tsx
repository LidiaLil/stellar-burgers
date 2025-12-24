import { getOrderByNumberApi, orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Определение типа состояния заказа
export interface OrderState {
  isLoading: boolean; // Идет ли загрузка данных
  order: TOrder | null; // Данные заказа
  error: string | null; // Ошибка при загрузке данных пользователя
}

// Начальное состояние заказа
const initialState: OrderState = {
  isLoading: false, // Загрузка не идет по умолчанию
  order: null, // Заказ отсутствует по умолчанию
  error: null // Ошибок нет по умолчанию
};

// Асинхронный экшен для создания заказа
export const createOrder = createAsyncThunk(
  'order/create', // Префикс для экшенов
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds); // Запрос к /api/orders
    return response.order; // Это станет action.payload в fulfilled
  }
);

// Асинхронный экшен для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber); // Запрос к /api/orders/:number
    if (!response.orders || response.orders.length === 0) {
      throw new Error('Заказ не найден');
    }
    return response.orders[0];
  }
);

// Слайс для управления состоянием заказа
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Редуктор для очистки состояния заказа
    clearOrderState: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка состояния ожидания создания заказа
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка успешного создания заказа
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      // Обработка ошибки при создании заказа
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Заказ не создан';
      })
      // Обработка состояния ожидания получения заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка успешного получения заказа по номеру
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.order = action.payload;
        }
      )
      // Обработка ошибки при получении заказа по номеру
      .addCase(
        fetchOrderByNumber.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error.message || 'Заказ не найден';
        }
      );
  },
  selectors: {
    selectOrderState: (state) => state, // Весь срез состояния закза
    selectOrder: (state) => state.order, // Получение данных заказа
    selectIsLoading: (state) => state.isLoading, // Проверка загрузки данных пользователя
    selectError: (state) => state.error // Получение ошибки пользователя
  }
});

export const { clearOrderState } = orderSlice.actions;

export default orderSlice.reducer;

export const {
  selectOrderState,
  selectOrder,
  selectIsLoading,
  selectError
} = orderSlice.selectors;
