import { getIngredientsApi } from '@api';
import { fetchIngredients } from '../slices/ingredientsSlice';
import { mockIngredients } from '../testHelpers';

// Мок для API
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('fetchIngredients thunk', () => {
  const mockGetIngredientsApi =
    getIngredientsApi as jest.MockedFunction<
      typeof getIngredientsApi
    >;

  beforeEach(() => {
    mockGetIngredientsApi.mockClear();
  });

  test('успешный вызов API', async () => {
    mockGetIngredientsApi.mockResolvedValue(
      mockIngredients
    );

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = fetchIngredients();
    await thunk(dispatch, getState, undefined);

    expect(mockGetIngredientsApi).toHaveBeenCalledTimes(1);
  });

  test('ошибка при вызове API', async () => {
    const error = new Error('Network Error');
    mockGetIngredientsApi.mockRejectedValue(error);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = fetchIngredients();
    await thunk(dispatch, getState, undefined);

    expect(mockGetIngredientsApi).toHaveBeenCalledTimes(1);
  });
});
