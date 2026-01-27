import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '@store';
import { selectFeed } from '../../services/slices/feedSlice';

const getOrders = (
  orders: TOrder[],
  status: string
): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feed = useSelector(selectFeed); // Лента заказов из стора
  const orders = feed?.orders || []; // Заказы пользователя из ленты заказов

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
