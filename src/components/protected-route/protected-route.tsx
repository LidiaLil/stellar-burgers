import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import {
  selectIsLoading,
  selectUser
} from '../../services/slices/userSlice';
import { useSelector } from '@store';

type ProtectedRouteProps = {
  children: ReactElement;
  anonymous?: boolean;
};

// Универсальный компонент защиты маршрутов
const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  anonymous = false // По умолчанию маршрут для авторизованных
}) => {
  const user = useSelector(selectUser); // Данные пользователя из стора
  const isAuth = !!user; // true, если user существует
  const loading = useSelector(selectIsLoading);
  const location = useLocation();
  const from = location.state?.from || '/';

  // Показываем прелоадер, пока идет проверка авторизации
  if (loading) return <Preloader />;

  // Если маршрут только для НЕавторизованных (логин, регистрация)
  if (anonymous && isAuth) {
    console.log('Уже авторизован, редирект на:', from);
    return <Navigate to={from} replace />;
  }

  // Если маршрут только для авторизованных (профиль) и пользователь НЕ авторизован
  if (!anonymous && !isAuth) {
    console.log('Неавторизован, отправлен на логин');
    return (
      <Navigate
        to='/login'
        state={{ from: location }}
        replace
      />
    );
  }

  // Если все проверки пройдены, рендерим дочерние компоненты
  console.log('Авторизован, доступ разрешен');
  return children;
};

export default ProtectedRoute;
