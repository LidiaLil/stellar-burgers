import {
  combineReducers,
  configureStore
} from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import {
  userReducer,
  orderReducer,
  ingredientsReducer,
  feedReducer,
  burgerConstructorReducer
} from '@slices';
export const rootReducer = combineReducers({
  user: userReducer,
  order: orderReducer,
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerConstructor: burgerConstructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () =>
  dispatchHook();

export const useSelector: TypedUseSelectorHook<RootState> =
  selectorHook;

export default store;
