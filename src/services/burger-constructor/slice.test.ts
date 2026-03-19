/// <reference types="jest" />

import {
  burgerConstructorSlice,
  addIngredient,
  addBun,
  removeIngredient,
  swapIngredients,
  clearConstructor,
  initialState
} from './slice';
import { TIngredient } from '@utils-types';

describe('burgerConstructor slice', () => {
  const ingredientMock: TIngredient = {
    _id: '1',
    name: 'Тестовый ингредиент',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'image.png',
    image_large: 'image_large.png',
    image_mobile: 'image_mobile.png'
  };

  const bunMock: TIngredient = {
    _id: '2',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    price: 200,
    image: 'bun.png',
    image_large: 'bun_large.png',
    image_mobile: 'bun_mobile.png'
  };

  describe('addIngredient', () => {
    it('Добавление ингредиента в конструктор', () => {
      const action = addIngredient(ingredientMock);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.ingredients.length).toBe(1);
      expect(state.ingredients[0]._id).toBe(ingredientMock._id);
      expect(state.ingredients[0].name).toBe(ingredientMock.name);
      expect(state.ingredients[0]).toHaveProperty('id');
    });
  });

  describe('addBun', () => {
    it('Добавление булки в конструктор', () => {
      const state = burgerConstructorSlice.reducer(
        initialState,
        addBun(bunMock)
      );

      expect(state.bun).not.toBeNull();
      expect(state.bun?._id).toBe(bunMock._id);
      expect(state.bun?.name).toBe(bunMock.name);
    });
  });

  describe('removeIngredient', () => {
    it('Удаление ингредиента из конструктора', () => {
      const prepareAction = addIngredient(ingredientMock);
      let state = burgerConstructorSlice.reducer(initialState, prepareAction);

      expect(state.ingredients.length).toBe(1);

      state = burgerConstructorSlice.reducer(
        state,
        removeIngredient(ingredientMock._id)
      );

      expect(state.ingredients.length).toBe(0);
    });

    it('Удаление только нужного ингредиента', () => {
      const firstIngredient = addIngredient(ingredientMock);
      let state = burgerConstructorSlice.reducer(initialState, firstIngredient);

      const secondIngredient = addIngredient({ ...ingredientMock, _id: '3' });
      state = burgerConstructorSlice.reducer(state, secondIngredient);

      expect(state.ingredients.length).toBe(2);

      state = burgerConstructorSlice.reducer(
        state,
        removeIngredient(ingredientMock._id)
      );

      expect(state.ingredients.length).toBe(1);
      expect(state.ingredients[0]._id).toBe('3');
    });
  });

  describe('swapIngredients', () => {
    it('Изменение порядка ингредиентов в начинке', () => {
      const firstAction = addIngredient({ ...ingredientMock, _id: 'first-id' });
      let state = burgerConstructorSlice.reducer(initialState, firstAction);

      const secondAction = addIngredient({
        ...ingredientMock,
        _id: 'second-id'
      });
      state = burgerConstructorSlice.reducer(state, secondAction);

      const thirdAction = addIngredient({ ...ingredientMock, _id: 'third-id' });
      state = burgerConstructorSlice.reducer(state, thirdAction);

      expect(state.ingredients[0]._id).toBe('first-id');
      expect(state.ingredients[1]._id).toBe('second-id');
      expect(state.ingredients[2]._id).toBe('third-id');

      state = burgerConstructorSlice.reducer(
        state,
        swapIngredients({ fromIndex: 0, toIndex: 2 })
      );

      expect(state.ingredients[0]._id).toBe('third-id');
      expect(state.ingredients[1]._id).toBe('second-id');
      expect(state.ingredients[2]._id).toBe('first-id');
    });

    it('Перемещение соседних ингредиентов', () => {
      const firstAction = addIngredient({ ...ingredientMock, _id: 'first-id' });
      let state = burgerConstructorSlice.reducer(initialState, firstAction);

      const secondAction = addIngredient({
        ...ingredientMock,
        _id: 'second-id'
      });
      state = burgerConstructorSlice.reducer(state, secondAction);

      expect(state.ingredients[0]._id).toBe('first-id');
      expect(state.ingredients[1]._id).toBe('second-id');

      state = burgerConstructorSlice.reducer(
        state,
        swapIngredients({ fromIndex: 0, toIndex: 1 })
      );

      expect(state.ingredients[0]._id).toBe('second-id');
      expect(state.ingredients[1]._id).toBe('first-id');
    });
  });

  describe('clearConstructor', () => {
    it('Очистка конструктора', () => {
      const ingredientAction = addIngredient(ingredientMock);
      let state = burgerConstructorSlice.reducer(
        initialState,
        ingredientAction
      );

      const bunAction = addBun(bunMock);
      state = burgerConstructorSlice.reducer(state, bunAction);

      expect(state.bun).not.toBeNull();
      expect(state.ingredients.length).toBe(1);

      state = burgerConstructorSlice.reducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients.length).toBe(0);
    });
  });
});
