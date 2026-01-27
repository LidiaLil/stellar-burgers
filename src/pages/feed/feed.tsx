import { AppDispatch } from '@store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '@store';
import {
  fetchFeed,
  selectIsLoading,
  selectOrdersFeed
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  // функция для получения данных из стора
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  // селекторы для получения данных из store
  const orders: TOrder[] = useSelector(selectOrdersFeed);
  const isLoading = useSelector(selectIsLoading); // состояние загрузки

  useEffect(() => {
    // При монтировании компонента загружаем обе ленты заказов
    dispatch(fetchFeed()); // Лента заказов
  }, [dispatch]); // Зависимость - dispatch, перезапускаем если dispatch меняется

  // Функция для ручного обновления данных
  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (!orders.length) {
    return 'Нет заказов';
  }
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={handleGetFeeds}
    />
  );
};
