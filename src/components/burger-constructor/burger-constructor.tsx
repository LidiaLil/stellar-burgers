import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@store';
import {
  clearConstructor,
  constructorState
} from '../../services/slices/burgerConstructorSlice';
import {
  clearOrderState,
  createOrder,
  selectIsLoading,
  selectOrder
} from '../../services/slices/orderSlice';
import { selectIsInit } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(constructorState); // берем из стора ингредиенты для конструктора

  const orderRequest = useSelector(selectIsLoading); // состояние загрузки заказа

  const orderModalData = useSelector(selectOrder); // данные заказа для модального окна

  const isAuthenticated = useSelector(selectIsInit); // проверка инициализации пользователя

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return; // если булки нет или уже идет запрос на создание заказа, выходим из функции
    const ingredientsId: string[] = [
      // создаем массив с id ингредиентов для заказа
      constructorItems.bun._id, // Верхняя булка
      constructorItems.bun._id, // Нижняя булка (добавляем второй раз)
      ...constructorItems.ingredients.map(
        (item) => item._id
      ) // остальные ингредиенты
    ];
    dispatch(createOrder(ingredientsId)); // диспатчим создание заказа с массивом id ингредиентов
  };

  const closeOrderModal = () => {
    dispatch(clearOrderState());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun
        ? constructorItems.bun.price * 2
        : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) =>
          s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
