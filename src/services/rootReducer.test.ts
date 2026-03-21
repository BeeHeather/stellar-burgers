/// <reference types="jest" />

import { rootReducer } from './rootReducer';
import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import ordersReducer from './slices/ordersSlice';
import { burgerConstructorSlice } from './burger-constructor/slice';

describe('rootReducer', () => {
  const initAction = { type: '@@INIT' };

  it('Правильная инициализация', () => {
    const state = rootReducer(undefined, initAction);

    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('burgerConstructor');
  });

  it('Инициализация с правильными начальными значениями', () => {
    const state = rootReducer(undefined, initAction);

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
      currentIngredient: null
    });

    expect(state.user).toEqual({
      user: null,
      isAuthenticated: false,
      isAuthChecked: false,
      isLoading: false,
      error: null
    });

    expect(state.orders).toEqual({
      orders: [],
      feeds: [],
      currentOrder: null,
      isLoading: false,
      error: null,
      total: 0,
      totalToday: 0
    });
  });

  it('rootReducer должен возвращать корректное начальное состояние', () => {
    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      user: userReducer(undefined, initAction),
      ingredients: ingredientsReducer(undefined, initAction),
      orders: ordersReducer(undefined, initAction),
      burgerConstructor: burgerConstructorSlice.reducer(undefined, initAction)
    });
  });

  it('rootReducer должен возвращать то же состояние при неизвестном экшене', () => {
    const prevState = rootReducer(undefined, initAction);
    const state = rootReducer(prevState, { type: 'UNKNOWN_ACTION' });

    expect(state).toBe(prevState);
  });

});
