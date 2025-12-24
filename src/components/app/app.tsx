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
import { useEffect } from 'react';
import { getCookie } from '../../utils/cookie';
import {
  getUserThunk,
  init
} from '../../services/slices/userSlice';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const background = location.state?.background; // Получаем фоновое местоположение из состояния навигации
  const ingredients: TIngredient[] = useSelector(
    selectIngredients
  );
  const onCloseModal = () => navigate(-1); // Функция закрытия модального окна

  useEffect(() => {
    console.log('Fetching ingredients...');
    if (!ingredients || ingredients.length === 0) {
      console.log('Необходимо загрузить ингредиенты.');
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients]);

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token) {
      dispatch(getUserThunk());
    } else {
      dispatch(init());
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Публичные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='*' element={<NotFound404 />} />

        {/* Защищенные маршруты */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищенные маршруты - только для авторизованных */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute onlyUnAuth={false}>
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
      </Routes>

      {/* Модальные окна */}
      {/* Модальные окна поверх текущей страницы */}
      {background && (
        <Routes>
          {/* Модалка с информацией о заказе в ленте */}
          <Route
            path='/feed/:number'
            element={
              <Modal
                onClose={onCloseModal}
                title={'Описание заказа'}
              >
                <OrderInfo />
              </Modal>
            }
          />

          {/* Модалка с информацией о ингредиенте */}
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                onClose={onCloseModal}
                title={'Описание ингредиента'}
              >
                <IngredientDetails />
              </Modal>
            }
          />

          {/* Модалка с информацией о заказе в профиле */}
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  onClose={onCloseModal}
                  title={'Описание заказа'}
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
