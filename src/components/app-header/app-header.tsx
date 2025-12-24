import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUserState } from '../../services/slices/userSlice';
import { useSelector } from '@store';

export const AppHeader: FC = () => {
  const { user } = useSelector(selectUserState);

  return <AppHeaderUI userName={user?.name} />;
};
