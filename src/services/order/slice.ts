import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { createOrder, getOrderByNumber } from './actions';

type TNewOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  price: number;
};

export type OrderState = {
  orderRequest: boolean;
  orderModalData: TNewOrder | null;
  currentOrder: TOrder | null;
};

export const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeModal: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectCurrentOrder: (state) => state.currentOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })

      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload.orders[0];
      });
  }
});

export const { selectOrderRequest, selectOrderModalData, selectCurrentOrder } =
  orderSlice.selectors;
export const { closeModal, clearCurrentOrder } = orderSlice.actions;
