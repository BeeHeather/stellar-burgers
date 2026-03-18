import { createSlice, nanoid } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export type BurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: { payload: TConstructorIngredient }) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    addBun: (state, action: { payload: TIngredient }) => {
      state.bun = action.payload;
    },
    addSauce: {
      reducer: (state, action: { payload: TConstructorIngredient }) => {
        state.ingredients = state.ingredients.filter(
          (ingredient) => ingredient.type !== 'sauce'
        );
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (state, action: { payload: string }) => {
      const index = state.ingredients.findIndex(
        (ingredient: TConstructorIngredient) =>
          ingredient._id === action.payload
      );

      state.ingredients.splice(index, 1);
    },
    removeIngredientAtIndex: (state, action: { payload: number }) => {
      state.ingredients.splice(action.payload, 1);
    },
    swapIngredients: (
      state,
      action: { payload: { fromIndex: number; toIndex: number } }
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const temp = state.ingredients[fromIndex];
      state.ingredients[fromIndex] = state.ingredients[toIndex];
      state.ingredients[toIndex] = temp;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectBurgerConstructor: (state) => state
  }
});

export const {
  addIngredient,
  addBun,
  addSauce,
  clearConstructor,
  removeIngredient,
  removeIngredientAtIndex,
  swapIngredients
} = burgerConstructorSlice.actions;
export const { selectBurgerConstructor } = burgerConstructorSlice.selectors;
