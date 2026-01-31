import feedReducer, {
  fetchFeed,
  fetchOrderFeed,
  initialState
} from '../slices/feedSlice';

// Моковые данные для тестов
const feedDataMock = {
  success: true,
  orders: [
    {
      _id: 'order1',
      ingredients: ['ingredient1', 'ingredient2'],
      status: 'done',
      name: 'Order 1',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 1
    },
    {
      _id: 'order2',
      ingredients: ['ingredient3', 'ingredient4'],
      status: 'pending',
      name: 'Order 2',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 2
    }
  ],
  total: 100,
  totalToday: 10
};

const ordersDataMock = [
  {
    _id: 'userOrder1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'done',
    name: 'User Order 1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 3
  },
  {
    _id: 'userOrder2',
    ingredients: ['ingredient3', 'ingredient4'],
    status: 'pending',
    name: 'User Order 2',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 4
  }
];

describe('feedSlice reducers', () => {
  it('Проверка начального состояния', () => {
    const state = feedReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });

  it('тест обработки экшена ожидания получения списка заказов', () => {
    const action = { type: fetchFeed.pending.type };
    const state = feedReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('тест обработки экшена успешного получения списка заказов', () => {
    const action = {
      type: fetchFeed.fulfilled.type,
      payload: feedDataMock
    };
    const state = feedReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      feed: feedDataMock,
      orders: feedDataMock.orders
    });
  });

  it('тест обработки экшена ошибки при получении списка заказов', () => {
    const errorMessage =
      'Ошибка при загрузке списка заказов';
    const action = {
      type: fetchFeed.rejected.type,
      error: { message: errorMessage }
    };
    const state = feedReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });

  describe('тесты для fetchOrderFeed', () => {
    it('тест обработки экшена ожидания получения пользовательских заказов', () => {
      const action = { type: fetchOrderFeed.pending.type };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('тест обработки экшена успешного получения пользовательских заказов', () => {
      const action = {
        type: fetchOrderFeed.fulfilled.type,
        payload: ordersDataMock
      };

      // Начальное состояние с уже существующими данными
      const stateWithExistingData = {
        ...initialState,
        feed: feedDataMock,
        orders: feedDataMock.orders
      };

      const state = feedReducer(
        stateWithExistingData,
        action
      );

      expect(state).toEqual({
        ...stateWithExistingData,
        isLoading: false,
        orders: ordersDataMock // orders заменяются на пользовательские заказы
      });
    });

    it('тест обработки экшена ошибки при получении пользовательских заказов', () => {
      const errorMessage =
        'Ошибка при загрузке заказов пользователя';
      const action = {
        type: fetchOrderFeed.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });
});