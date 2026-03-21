/// <reference types="jest" />

import ingredientsReducer, {
  getIngredients,
  setCurrentIngredient,
  initialState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredients slice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 100,
      image: 'bun.png',
      image_large: 'bun_large.png',
      image_mobile: 'bun_mobile.png'
    },
    {
      _id: '2',
      name: 'Соус',
      type: 'sauce',
      proteins: 5,
      fat: 10,
      carbohydrates: 15,
      calories: 100,
      price: 50,
      image: 'sauce.png',
      image_large: 'sauce_large.png',
      image_mobile: 'sauce_mobile.png'
    }
  ];

  describe('getIngredients pending', () => {
    it('isLoading меняется на true', () => {
      const action = { type: getIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('getIngredients fulfilled', () => {
    it('Данные записываются в стор, isLoading меняется на false', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('getIngredients rejected', () => {
    it('Ошибка записывается в стор, isLoading меняется на false', () => {
      const errorMessage = 'Failed to load ingredients';
      const action = {
        type: getIngredients.rejected.type,
        payload: errorMessage
      };
      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('setCurrentIngredient', () => {
    it('Установка текущего ингредиента по id', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: mockIngredients
      };

      const state = ingredientsReducer(
        stateWithIngredients,
        setCurrentIngredient('1')
      );

      expect(state.currentIngredient).toEqual(mockIngredients[0]);
    });

    it('сброс текущего ингредиента при undefined', () => {
      const stateWithCurrent = {
        ...initialState,
        ingredients: mockIngredients,
        currentIngredient: mockIngredients[0]
      };

      const state = ingredientsReducer(
        stateWithCurrent,
        setCurrentIngredient(undefined)
      );

      expect(state.currentIngredient).toBeNull();
    });
  });
});
