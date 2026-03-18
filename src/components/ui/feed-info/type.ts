import { TOrder } from '@utils-types';

export type FeedInfo = {
  orders?: TOrder[];
  total: number;
  totalToday: number;
  isLoading?: boolean;
  error?: string | null;
};

export type FeedInfoUIProps = {
  feed: FeedInfo;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
