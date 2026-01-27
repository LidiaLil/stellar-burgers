import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  deleteCookie,
  setCookie
} from '../../utils/cookie';

// Определение типа состояния пользователя
export interface UserState {
  isInit: boolean; // Инициализирован ли пользователь
  isLoading: boolean; // Идет ли загрузка данных пользователя
  user: TUser | null; // Данные пользователя
  error: string | null; // Ошибка при загрузке данных пользователя
}

// Начальное состояние пользователя
const initialState: UserState = {
  isInit: false, // Пользователь не инициализирован по умолчанию
  isLoading: false, // Загрузка не идет по умолчанию
  user: null, // Пользователь не авторизован по умолчанию
  error: null // Ошибок нет по умолчанию
};

// Асинхронный экшен для регистрации пользователя
export const registerUser = createAsyncThunk(
  'user/register', // Префикс для экшенов
  async (data: TRegisterData) => {
    // Функция-исполнитель
    const responce = await registerUserApi(data);
    localStorage.setItem(
      'refreshToken',
      responce.refreshToken
    );
    setCookie('accessToken', responce.accessToken);
    return responce.user; // Это станет action.payload в fulfilled
  }
);

// Асинхронный экшен для входа пользователя
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const responce = await loginUserApi(data);
    localStorage.setItem(
      'refreshToken',
      responce.refreshToken
    );
    setCookie('accessToken', responce.accessToken);
    return responce.user;
  }
);

// Асинхронный экшен для получения данных пользователя
//Используется при загрузке приложения, чтобы проверить авторизацию.
export const getUser = createAsyncThunk(
  'user/getUser',
  async () => {
    const response = await getUserApi(); // Запрос к /api/user
    return response.user;
  }
);

// Обновление пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    // Partial - можно передать не все поля, а только те, которые нужно обновить.
    const response = await updateUserApi(user);
    return response.user;
  }
);

// Выход из системы
export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => {
    await logoutApi(); // Уведомляем сервер о выходе
    deleteCookie('accessToken'); // Удаляем токены
    localStorage.removeItem('refreshToken'); // Ничего не возвращаем, так как просто очищаем
  }
);

// Создание среза состояния пользователя
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInit = true; // Установка флага инициализации пользователя
    }
  },
  extraReducers: (builder) => {
    // Обрабатывают экшены, созданные createAsyncThunk
    builder
      // Регистрация пользователя в процессе
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Регистрация пользователя успешна
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isInit = true;
      })
      // Регистрация пользователя неуспешна
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ||
          'Ошибка при регистрации пользователя';
      })
      // Вход пользователя в процессе
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Вход пользователя успешен
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isInit = true;
      })
      // Вход пользователя неуспешен
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ||
          'Ошибка при входе пользователя';
      })
      // Получение данных пользователя в процессе
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Получение данных пользователя успешно
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isInit = true;
      })
      // Получение данных пользователя неуспешно
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isInit = false;
        state.user = null;
        state.error =
          action.error.message ||
          'Пользователь не авторизован';
      })
      // Обновление данных пользователя в процессе
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обновление данных пользователя успешно
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      // Обновление данных пользователя неуспешно
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ||
          'Ошибка при обновлении данных пользователя';
      })
      // Выход из системы в процессе
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Выход из системы успешен
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isInit = false;
      })
      // Выход из системы неуспешен
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ||
          'Ошибка при выходе из системы';
      });
  },
  selectors: {
    selectUserState: (state) => state, // Весь срез состояния пользователя
    selectUser: (state) => state.user, // Получение данных пользователя
    selectIsInit: (state) => state.isInit, // Проверка инициализации пользователя
    selectIsLoading: (state) => state.isLoading, // Проверка загрузки данных пользователя
    selectError: (state) => state.error // Получение ошибки пользователя
  }
});

export const { init } = userSlice.actions;
export const {
  selectUserState,
  selectUser,
  selectIsInit,
  selectIsLoading,
  selectError
} = userSlice.selectors;
export default userSlice.reducer;
