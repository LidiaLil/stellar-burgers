// Написан тест, проверяющий правильную настройку и работу rootReducer:
// вызов rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером (например, { type: 'UNKNOWN_ACTION' }), возвращает корректное начальное состояние хранилища.
// Написаны тесты, проверяющие работу редьюсера конструктора бургера при обработке экшенов добавления и удаления ингредиента.
// Написаны тесты, проверяющие обработку редьюсером экшенов, генерируемых при выполнении асинхронного запроса:
// экшены начала запроса, успешного выполнения запроса и ошибки запроса.

import store, { rootReducer } from '../store';
import type { UnknownAction } from '@reduxjs/toolkit';

describe('тест, проверяющий правильную настройку и работу rootReducer', () => {
  it('вызов rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером, возвращает корректное начальное состояние хранилища.', () => {
    const initialStateFromReducer = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    } as UnknownAction);
    const initialStateFromStore = store.getState();

    expect(initialStateFromReducer).toEqual(
      initialStateFromStore
    );
  });
});
