import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import type { RootState } from '../store';

export interface OrdersState {
  orders: TOrder[];
  feeds: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
}

export const initialState: OrdersState = {
  orders: [],
  feeds: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  total: 0,
  totalToday: 0
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to create order');
    }
  }
);

export const getFeeds = createAsyncThunk(
  'orders/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue('Failed to load feeds');
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error) {
      return rejectWithValue('Failed to load user orders');
    }
  }
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to load order details');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrders: (state) => {
      state.orders = [];
    },
    clearFeeds: (state) => {
      state.feeds = [];
    },
    closeOrderModal: (state) => {
      state.currentOrder = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        const order = action.payload.order;
        const mappedOrder: TOrder = {
          _id: order._id,
          status: order.status,
          name: order.name,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          number: order.number,
          ingredients: []
        };
        state.currentOrder = mappedOrder;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.feeds = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        const order = action.payload.orders[0];
        state.currentOrder = order || null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentOrder, clearOrders, clearFeeds, closeOrderModal } =
  ordersSlice.actions;
export default ordersSlice.reducer;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectFeeds = (state: RootState) => state.orders.feeds;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectUserOrders = (state: RootState) => state.orders.orders;
export const selectOrderTotal = (state: RootState) => state.orders.total;
export const selectOrderTotalToday = (state: RootState) =>
  state.orders.totalToday;
