/// <reference types="jest" />

import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('Правильная инициализация', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('burgerConstructor');
  });

  it('Инициализация с правильными начальными значениями', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

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
  });
});
