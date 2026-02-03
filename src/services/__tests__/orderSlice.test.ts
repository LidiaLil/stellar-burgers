import orderReducer, {
  createOrder,
  fetchOrderByNumber,
  clearOrderState
} from '../slices/orderSlice';

// Моковые данные для тестов
const mockOrder = {
  _id: 'order_123',
  ingredients: ['ingredient1', 'ingredient2'],
  status: 'done',
  name: 'Самый вкусный тестовый бургер',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345
};

// Начальное состояние
const initialState = {
  isLoading: false,
  order: null,
  error: null
};

describe('orderSlice редьюсеры', () => {
  it('должно возвращать корректное начальное состояние', () => {
    // Инициализация редьюсера для получения стартового состояния
    const state = orderReducer(undefined, {
      type: '@@INIT'
    });
    expect(state).toEqual(initialState);
  });
});

it('должен очищать состояние заказа', () => {
  // Состояние с данными заказа
  const stateWithOrder = {
    isLoading: false,
    order: mockOrder,
    error: null
  };

  const action = clearOrderState();
  const state = orderReducer(stateWithOrder, action);

  expect(state).toEqual(initialState);
});

describe('Асинхронный экшен createOrder', () => {
  it('должен обрабатывать createOrder.pending - ожидание создания заказа', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('должен обрабатывать createOrder.fulfilled - успешное создание заказа', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      order: mockOrder,
      error: null
    });
  });

  it('должен обрабатывать createOrder.rejected - ошибка при создании заказа', () => {
    const errorMessage = 'Ошибка сети';
    const action = {
      type: createOrder.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });

  it('должен обрабатывать createOrder.rejected с сообщением об ошибке по умолчанию', () => {
    const action = {
      type: createOrder.rejected.type,
      error: {}
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Заказ не создан'
    });
  });
});

describe('Асинхронный экшен fetchOrderByNumber', () => {
  it('должен обрабатывать fetchOrderByNumber.pending - ожидание получения заказа по номеру', () => {
    const action = {
      type: fetchOrderByNumber.pending.type
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('должен обрабатывать fetchOrderByNumber.fulfilled - успешное получение заказа по номеру', () => {
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      order: mockOrder,
      error: null
    });
  });

  it('должен обрабатывать fetchOrderByNumber.rejected - ошибка при получении заказа по номеру', () => {
    const errorMessage = 'Заказ не найден';
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });
});
