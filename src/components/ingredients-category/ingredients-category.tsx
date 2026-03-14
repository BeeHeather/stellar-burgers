import { forwardRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TIngredientsCategoryProps } from './type';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { selectBurgerConstructor } from '../../services/burger-constructor/slice';
import type { RootState } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    const idCounts: { [key: string]: number } = {};
    constructorIngredients.forEach((ingredient: TConstructorIngredient) => {
      idCounts[ingredient._id] = (idCounts[ingredient._id] || 0) + 1;
    });

    ingredients.forEach((ingredient: TIngredient) => {
      if (ingredient.type === 'bun') {
        if (bun && bun._id === ingredient._id) {
          counters[ingredient._id] = 2;
        }
      } else if (idCounts[ingredient._id]) {
        counters[ingredient._id] = idCounts[ingredient._id];
      }
    });

    return counters;
  }, [ingredients, constructorIngredients, bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
