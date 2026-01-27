import { useDispatch, useSelector } from '@store';
import { ProfileUI } from '@ui-pages';
import {
  FC,
  SyntheticEvent,
  useEffect,
  useState
} from 'react';
import {
  selectUserState,
  updateUser
} from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  /** TODO: взять переменную из стора */
  const { user, error } = useSelector(selectUserState);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue((prevState) => ({
      ...prevState,
      password: ''
    }));
    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password || undefined
      })
    );
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error || undefined}
    />
  );
};
