import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '@store';
import { logoutUser } from '../../services/slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser()); // Выполняем выход из системы
    navigate('/login', { replace: true }); // Перенаправляем на страницу входа
  };

  return (
    <ProfileMenuUI
      handleLogout={handleLogout}
      pathname={pathname}
    />
  );
};
