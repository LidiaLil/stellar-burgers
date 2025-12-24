import {
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  ProfileOrders,
  ResetPassword,
  NotFound404,
  Profile,
  Register
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo
} from '@components';
import ProtectedRoute from '../protected-route/protected-route';
import { useDispatch, useSelector } from '@store';
import { useEffect, useState } from 'react';
import { getCookie } from '../../utils/cookie';
import {
  getUser,
  init,
  selectUser,
  selectIsInit,
  selectIsLoading
} from '../../services/slices/userSlice';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';
import { clearOrderState } from '../../services/slices/orderSlice';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state?.background;

  // Получаем номер заказа из пути, если он там есть
  const getOrderNumber = () => {
    const path = location.pathname.split('/'); // Разделяем путь на части
    const orderNumber = path[path.length - 1]; // Последняя часть пути - номер заказа
    return isNaN(Number(orderNumber)) ? '' : orderNumber;
  };

  const orderNumber = getOrderNumber();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken =
      localStorage.getItem('refreshToken');
    if (accessToken || refreshToken) dispatch(getUser());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
    dispatch(clearOrderState());
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute anonymous>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute anonymous>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute anonymous>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute anonymous>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/feed/:number'
          element={<OrderInfo />}
        />
        <Route
          path='/ingredients/:id'
          element={<IngredientDetails />}
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`Информация по заказу #${orderNumber}`}
                onClose={handleModalClose}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Состав ингредиента'
                onClose={() => {
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={`Информация по заказу #${orderNumber}`}
                  onClose={handleModalClose}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
