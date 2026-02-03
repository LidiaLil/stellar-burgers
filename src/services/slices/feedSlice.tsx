import { getFeedsApi, getOrdersApi } from '@api';
import {
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

// Асинхронный экшен для получения публичной ленты заказов
export const fetchFeed = createAsyncThunk(
  'feed/fetch',
  getFeedsApi // функция API для получения ленты заказов
);

// Асинхронный экшен для получения заказов пользователя
export const fetchOrderFeed = createAsyncThunk(
  'feed/orderFetch',
  getOrdersApi // функция API для получения заказов пользователя
);

const feedSlice = createSlice({
  name: 'feed',
  // Начальное состояние в слайсе
  initialState: {
    feed: null as TOrdersData | null, // Лента заказов публичная
    orders: [] as TOrder[], // Заказы пользователя
    isLoading: false,
    error: null as string | null
  },
  reducers: {}, // обычные редьюсеры отсутствуют, так как используются только асинхронные экшены
  extraReducers: (builder) => {
    builder
      // Ожидание получения списка заказов
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Успешное получение списка заказов
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
        state.orders = action.payload.orders;
      })
      // Ошибка при получении списка заказов
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ||
          'Ошибка при загрузке списка заказов';
      })
      // Ожидание получения заказов пользователя
      .addCase(fetchOrderFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Успешное получение заказов пользователя
      .addCase(
        fetchOrderFeed.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      // Ошибка при получении заказов пользователя
      .addCase(fetchOrderFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ||
          'Ошибка при загрузке заказов пользователя';
      });
  },
  selectors: {
    selectFeed: (state) => state.feed, // Лента заказов
    selectOrdersFeed: (state) => state.orders, // Заказы пользователя
    selectIsLoading: (state) => state.isLoading, // Статус загрузки
    selectError: (state) => state.error // Ошибка загрузки
  }
});

export default feedSlice.reducer;
export const {
  selectFeed,
  selectOrdersFeed,
  selectIsLoading,
  selectError
} = feedSlice.selectors;

// Экспортируем initialState для тестов
export const initialState = {
  feed: null as TOrdersData | null,
  orders: [] as TOrder[],
  isLoading: false,
  error: null as string | null
};
