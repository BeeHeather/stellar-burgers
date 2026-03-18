import { FC, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  createOrder,
  closeOrderModal
} from '../../services/slices/ordersSlice';
import { BurgerConstructorUI } from '@ui';
import { TIngredient } from '@utils-types';
import { selectIsAuthenticated } from '../../services/slices/userSlice';
import {
  selectBurgerConstructor,
  clearConstructor
} from '../../services/burger-constructor/slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectBurgerConstructor);
  const { currentOrder, isLoading: orderRequest } = useSelector(
    (state: any) => state.orders
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(closeOrderModal());
  }, [dispatch]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    const allIngredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i: TIngredient) => i._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(allIngredientIds));
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
    dispatch(clearConstructor());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TIngredient) => sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={currentOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
