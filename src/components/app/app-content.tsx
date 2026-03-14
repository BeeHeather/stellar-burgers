import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { ProtectedRoute } from '../protected-route';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/slices/userSlice';
import { getIngredients } from '../../services/slices/ingredientsSlice';

const AppHeaderLayout: FC = () => (
  <div className={styles.app}>
    <AppHeader />
    <Outlet />
  </div>
);

const ModalOrderFeed = () => {
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();

  const handleClose = () => {
    navigate('/feed');
  };

  return (
    <Modal title={`#${number}`} onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};

const ModalIngredient = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <Modal title='Детали ингредиента' onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

const ModalOrderProfile = () => {
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();

  const handleClose = () => {
    navigate('/profile/orders');
  };

  return (
    <Modal title={`#${number}`} onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};

export const AppContent = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const background = state?.backgroundLocation;

  const dispatch = useDispatch();
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    dispatch(getIngredients());
    if (!isAuthChecked) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthChecked]);

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<AppHeaderLayout />}>
          <Route index element={<ConstructorPage />} />
          <Route path='feed' element={<Feed />} />
          <Route
            path='login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Route>
      </Routes>

      <Routes location={location}>
        <Route path='ingredients/:id' element={<ModalIngredient />} />
        <Route path='feed/:number' element={<ModalOrderFeed />} />
        <Route
          path='profile/orders/:number'
          element={
            <ProtectedRoute>
              <ModalOrderProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};
