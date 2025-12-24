import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import {
  selectIsInit,
  selectIsLoading,
  selectUser
} from '../../services/slices/userSlice';
import { useSelector } from '@store';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

// Универсальный компонент защиты маршрутов
const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false // true = для авторизованных, false = для неавторизованных
}) => {
  const user = useSelector(selectUser); // Данные пользователя из стора
  const isAuth = !!user; // true, если user существует
  const loading = useSelector(selectIsLoading);
  const location = useLocation();
  const from = location.state?.from || '/';

  // Отладочный вывод
  console.log('ProtectedRoute debug:', {
    user,
    isAuth,
    loading,
    onlyUnAuth,
    pathname: location.pathname,
    hasUser: !!user
  });

  // Показываем прелоадер, пока идет проверка авторизации
  if (loading) return <Preloader />;

  // Если маршрут только для НЕавторизованных (логин, регистрация)
  if (onlyUnAuth && isAuth) {
    console.log('Уже авторизован, редирект на:', from);
    return <Navigate to={from} replace />;
  }

  // Если маршрут только для авторизованных (профиль) и пользователь НЕ авторизован
  if (!onlyUnAuth && !isAuth) {
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
