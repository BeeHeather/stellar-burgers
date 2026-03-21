/// <reference types="jest" />

import ordersReducer, {
  createOrder,
  getFeeds,
  getUserOrders,
  getOrderByNumber,
  clearCurrentOrder,
  clearOrders,
  clearFeeds,
  closeOrderModal,
  initialState
} from './ordersSlice';
import { TOrder } from '@utils-types';

describe('orders slice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Test Order',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 12345,
    ingredients: ['ing1', 'ing2']
  };

  const mockApiOrder = {
    _id: '1',
    status: 'done',
    name: 'Test Order',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 12345
  };

  describe('createOrder', () => {
    it('pending: isLoading=true, error=null', () => {
      const action = { type: createOrder.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: currentOrder set, isLoading=false, error=null', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: { order: mockApiOrder }
      };
      const state = ordersReducer({ ...initialState, isLoading: true }, action);

      expect(state.currentOrder).toEqual({
        _id: mockApiOrder._id,
        status: mockApiOrder.status,
        name: mockApiOrder.name,
        createdAt: mockApiOrder.createdAt,
        updatedAt: mockApiOrder.updatedAt,
        number: mockApiOrder.number,
        ingredients: []
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected: error set, isLoading=false', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: createOrder.rejected.type,
        payload: errorMessage
      };
      const state = ordersReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getFeeds', () => {
    it('pending: isLoading=true, error=null', () => {
      const action = { type: getFeeds.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: feeds set, total/totalToday updated, isLoading=false, error=null', () => {
      const feedsResponse = {
        orders: [mockOrder],
        total: 100,
        totalToday: 10
      };
      const action = {
        type: getFeeds.fulfilled.type,
        payload: feedsResponse
      };
      const state = ordersReducer({ ...initialState, isLoading: true }, action);

      expect(state.feeds).toEqual(feedsResponse.orders);
      expect(state.total).toBe(feedsResponse.total);
      expect(state.totalToday).toBe(feedsResponse.totalToday);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected: error set, isLoading=false', () => {
      const errorMessage = 'Failed to load feeds';
      const action = {
        type: getFeeds.rejected.type,
        payload: errorMessage
      };
      const state = ordersReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getUserOrders', () => {
    it('pending: isLoading=true, error=null', () => {
      const action = { type: getUserOrders.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: orders set, isLoading=false, error=null', () => {
      const userOrders = [mockOrder];
      const action = {
        type: getUserOrders.fulfilled.type,
        payload: userOrders
      };
      const state = ordersReducer({ ...initialState, isLoading: true }, action);

      expect(state.orders).toEqual(userOrders);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected: error set, isLoading=false', () => {
      const errorMessage = 'Failed to load user orders';
      const action = {
        type: getUserOrders.rejected.type,
        payload: errorMessage
      };
      const state = ordersReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getOrderByNumber', () => {
    it('pending: isLoading=true, error=null', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: currentOrder set from orders array, isLoading=false, error=null', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: [mockOrder] }
      };
      const state = ordersReducer({ ...initialState, isLoading: true }, action);

      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('fulfilled: currentOrder is null when orders array is empty', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: [] }
      };
      const state = ordersReducer(
        { ...initialState, isLoading: true, currentOrder: mockOrder },
        action
      );

      expect(state.currentOrder).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected: error set, isLoading=false', () => {
      const errorMessage = 'Failed to load order details';
      const action = {
        type: getOrderByNumber.rejected.type,
        payload: errorMessage
      };
      const state = ordersReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('clearCurrentOrder', () => {
    it('clears currentOrder', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: mockOrder
      };

      const state = ordersReducer(stateWithOrder, clearCurrentOrder());

      expect(state.currentOrder).toBeNull();
    });
  });

  describe('clearOrders', () => {
    it('clears orders array', () => {
      const stateWithOrders = {
        ...initialState,
        orders: [mockOrder]
      };

      const state = ordersReducer(stateWithOrders, clearOrders());

      expect(state.orders).toEqual([]);
    });
  });

  describe('clearFeeds', () => {
    it('clears feeds array', () => {
      const stateWithFeeds = {
        ...initialState,
        feeds: [mockOrder]
      };

      const state = ordersReducer(stateWithFeeds, clearFeeds());

      expect(state.feeds).toEqual([]);
    });
  });

  describe('closeOrderModal', () => {
    it('clears currentOrder and sets isLoading=false', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: mockOrder,
        isLoading: true
      };

      const state = ordersReducer(stateWithOrder, closeOrderModal());

      expect(state.currentOrder).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });
});
