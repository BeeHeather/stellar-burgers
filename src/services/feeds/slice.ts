import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getFeeds } from './actions';

export type FeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export const initialState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearFeeds: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    }
  },
  selectors: {
    selectFeeds: (state) => state.orders,
    selectFeedsStats: (state) => ({
      total: state.total,
      totalToday: state.totalToday
    })
  },
  extraReducers: (builder) => {
    builder.addCase(getFeeds.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
  }
});

export const { selectFeeds, selectFeedsStats } = feedsSlice.selectors;
export const { clearFeeds } = feedsSlice.actions;
