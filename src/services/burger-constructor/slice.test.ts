/// <reference types="jest" />

import {
  burgerConstructorSlice,
  addIngredient,
  addBun,
  addSauce,
  removeIngredient,
  removeIngredientAtIndex,
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

  describe('addSauce', () => {
    it('Добавление соуса удаляет предыдущий соус и добавляет новый', () => {
      const sauceMock: TIngredient = {
        _id: '3',
        name: 'Тестовый соус',
        type: 'sauce',
        proteins: 5,
        fat: 10,
        carbohydrates: 5,
        calories: 50,
        price: 30,
        image: 'sauce.png',
        image_large: 'sauce_large.png',
        image_mobile: 'sauce_mobile.png'
      };

      const firstSauceAction = addSauce(sauceMock);
      let state = burgerConstructorSlice.reducer(initialState, firstSauceAction);

      expect(state.ingredients.length).toBe(1);
      expect(state.ingredients[0]._id).toBe(sauceMock._id);
      expect(state.ingredients[0]).toHaveProperty('id');

      const newSauceMock = { ...sauceMock, _id: '4', name: 'Новый соус' };
      const secondSauceAction = addSauce(newSauceMock);
      state = burgerConstructorSlice.reducer(state, secondSauceAction);

      expect(state.ingredients.length).toBe(1);
      expect(state.ingredients[0]._id).toBe('4');
      expect(state.ingredients[0].name).toBe('Новый соус');
    });

    it('Добавление соуса не затрагивает другие ингредиенты', () => {
      const sauceMock: TIngredient = {
        _id: '3',
        name: 'Тестовый соус',
        type: 'sauce',
        proteins: 5,
        fat: 10,
        carbohydrates: 5,
        calories: 50,
        price: 30,
        image: 'sauce.png',
        image_large: 'sauce_large.png',
        image_mobile: 'sauce_mobile.png'
      };

      const ingredientAction = addIngredient(ingredientMock);
      let state = burgerConstructorSlice.reducer(initialState, ingredientAction);

      const sauceAction = addSauce(sauceMock);
      state = burgerConstructorSlice.reducer(state, sauceAction);

      expect(state.ingredients.length).toBe(2);
      expect(state.ingredients[0]._id).toBe(ingredientMock._id);
      expect(state.ingredients[1].type).toBe('sauce');
    });
  });

  describe('removeIngredientAtIndex', () => {
    it('Удаление ингредиента по индексу', () => {
      const firstAction = addIngredient({ ...ingredientMock, _id: 'first' });
      let state = burgerConstructorSlice.reducer(initialState, firstAction);

      const secondAction = addIngredient({ ...ingredientMock, _id: 'second' });
      state = burgerConstructorSlice.reducer(state, secondAction);

      const thirdAction = addIngredient({ ...ingredientMock, _id: 'third' });
      state = burgerConstructorSlice.reducer(state, thirdAction);

      expect(state.ingredients.length).toBe(3);

      state = burgerConstructorSlice.reducer(
        state,
        removeIngredientAtIndex(1)
      );

      expect(state.ingredients.length).toBe(2);
      expect(state.ingredients[0]._id).toBe('first');
      expect(state.ingredients[1]._id).toBe('third');
    });

    it('Удаление ингредиента по индексу 0', () => {
      const firstAction = addIngredient({ ...ingredientMock, _id: 'first' });
      let state = burgerConstructorSlice.reducer(initialState, firstAction);

      const secondAction = addIngredient({ ...ingredientMock, _id: 'second' });
      state = burgerConstructorSlice.reducer(state, secondAction);

      expect(state.ingredients.length).toBe(2);

      state = burgerConstructorSlice.reducer(state, removeIngredientAtIndex(0));

      expect(state.ingredients.length).toBe(1);
      expect(state.ingredients[0]._id).toBe('second');
    });
  });
});
