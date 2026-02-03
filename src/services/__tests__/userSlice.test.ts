import { TUser } from '@utils-types';
import userReducer, {
  init,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser
} from '../slices/userSlice';

// Моковые данные пользователя
const userMock: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

// Начальное состояние пользователя
const initialState = {
  isInit: false,
  isLoading: false,
  user: null,
  error: null
};

describe('Редьюсер слайса пользователя', () => {
  it('должен обрабатывать экшен init', () => {
    const action = { type: init.type };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isInit: true
    });
  });
});

describe('Асинхронный экшен: registerUser', () => {
  it('должен обрабатывать экшен регистрации пользователя в процессе', () => {
    const action = { type: registerUser.pending.type };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('должен обрабатывать экшен успешной регистрации пользователя', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: userMock
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      user: userMock,
      isInit: true
    });
  });

  it('должен обрабатывать экшен ошибки регистрации пользователя', () => {
    const errorMessage =
      'Ошибка при регистрации пользователя';
    const action = {
      type: registerUser.rejected.type,
      error: { message: errorMessage }
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });
});

describe('Асинхронный экшен: loginUser', () => {
  it('должен обрабатывать экшен входа пользователя в процессе', () => {
    const action = { type: loginUser.pending.type };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('должен обрабатывать экшен успешного входа пользователя', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: userMock
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      user: userMock,
      isInit: true
    });
  });

  it('должен обрабатывать экшен ошибки входа пользователя', () => {
    const errorMessage = 'Неверные учетные данные';
    const action = {
      type: loginUser.rejected.type,
      error: { message: errorMessage }
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });
});

describe('Асинхронный экшен: getUser', () => {
  it('должен обрабатывать экшен получения данных пользователя в процессе', () => {
    const action = { type: getUser.pending.type };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('должен обрабатывать экшен успешного получения данных пользователя', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: userMock
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      user: userMock,
      isInit: true
    });
  });

  it('должен обрабатывать экшен ошибки получения данных пользователя', () => {
    const errorMessage = 'Пользователь не авторизован';
    const action = {
      type: getUser.rejected.type,
      error: { message: errorMessage }
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      isInit: false,
      user: null,
      error: errorMessage
    });
  });
});

describe('Асинхронный экшен: updateUser', () => {
  const updatedUser = {
    email: 'updated@example.com',
    name: 'Updated User'
  };

  it('должен обрабатывать экшен обновления данных пользователя в процессе', () => {
    const action = { type: updateUser.pending.type };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('должен обрабатывать экшен успешного обновления данных пользователя', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    };

    // Начальное состояние с существующим пользователем
    const stateWithUser = {
      ...initialState,
      user: userMock
    };

    const state = userReducer(stateWithUser, action);

    expect(state).toEqual({
      ...stateWithUser,
      isLoading: false,
      user: updatedUser
    });
  });

  it('должен обрабатывать экшен ошибки обновления данных пользователя', () => {
    const errorMessage =
      'Ошибка при обновлении данных пользователя';
    const action = {
      type: updateUser.rejected.type,
      error: { message: errorMessage }
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });
});

describe('Асинхронный экшен: logoutUser', () => {
  it('должен обрабатывать экшен выхода из системы в процессе', () => {
    const action = { type: logoutUser.pending.type };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('должен обрабатывать экшен успешного выхода из системы', () => {
    const action = {
      type: logoutUser.fulfilled.type
    };

    // Начальное состояние с авторизованным пользователем
    const stateWithUser = {
      isInit: true,
      isLoading: false,
      user: userMock,
      error: null
    };

    const state = userReducer(stateWithUser, action);

    expect(state).toEqual({
      ...stateWithUser,
      isLoading: false,
      user: null,
      isInit: false
    });
  });

  it('должен обрабатывать экшен ошибки выхода из системы', () => {
    const errorMessage = 'Ошибка при выходе из системы';
    const action = {
      type: logoutUser.rejected.type,
      error: { message: errorMessage }
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });
});
