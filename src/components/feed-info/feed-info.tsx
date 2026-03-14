import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import {
  selectFeeds,
  selectOrderTotal,
  selectOrderTotalToday
} from '../../services/slices/ordersSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feeds = useSelector(selectFeeds);
  const total = useSelector(selectOrderTotal);
  const totalToday = useSelector(selectOrderTotalToday);

  const feedInfo = {
    total: total || 0,
    totalToday: totalToday || 0
  };

  const readyOrders = getOrders(feeds, 'done');
  const pendingOrders = getOrders(feeds, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feedInfo}
    />
  );
};
