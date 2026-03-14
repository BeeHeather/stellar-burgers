import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  onClick?: (ingredient: TConstructorIngredient) => void;
  handleMoveUp?: () => void;
  handleMoveDown?: () => void;
  handleClose?: () => void;
};
