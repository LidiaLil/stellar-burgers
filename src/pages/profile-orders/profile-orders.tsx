import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  useDispatch,
  useSelector
} from '../../services/store';
import {
  fetchOrderFeed,
  selectIsLoading,
  selectOrdersFeed
} from '../../services/slices/feedSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectOrdersFeed);
  const loading = useSelector(selectIsLoading);

  useEffect(() => {
    // При монтировании компонента загружаем заказы пользователя
    dispatch(fetchOrderFeed());
  }, [dispatch]); // Зависимость - dispatch, перезапускаем если dispatch меняется

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
