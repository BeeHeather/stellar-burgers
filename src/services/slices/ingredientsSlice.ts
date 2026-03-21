import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';
import type { RootState } from '../store';

export interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
  currentIngredient: TIngredient | null;
}

export const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
  currentIngredient: null
};

export const getIngredients = createAsyncThunk(
  'ingredients/get',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to load ingredients');
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: { payload: string | undefined }) => {
      const ingredients = state.ingredients;
      const arr = [...ingredients];
      const ingredient = arr.find(
        (ingredient) => ingredient._id === action.payload
      );
      if (ingredient) state.currentIngredient = ingredient;
      else state.currentIngredient = null;
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectCurrentIngredient: (state) => {
      const ingredient = state.ingredients.find(
        (ingredient) => ingredient._id === state.currentIngredient?._id
      );
      return ingredient;
    },
    selectIsIngredientsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  selectIngredients,
  selectCurrentIngredient,
  selectIsIngredientsLoading
} = ingredientsSlice.selectors;

export const { setCurrentIngredient } = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
