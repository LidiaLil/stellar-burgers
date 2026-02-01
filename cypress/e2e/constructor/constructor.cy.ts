import type { TIngredient } from '@utils-types';

describe('Главная страница', () => {
  beforeEach(() => {
    // Перехватываем запрос ингредиентов
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients'); // Мок ответа сервера для получения ингредиентов
    cy.intercept('GET', '/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser'); // Мок ответа сервера для получения данных пользователя
    cy.intercept('POST', '/api/orders', {
      fixture: 'order.json'
    }).as('postOrder'); // Мок ответа сервера для создания заказа

    // Авторизуемся
    window.localStorage.setItem(
      'refreshToken',
      'test-refresh-token'
    );
    cy.setCookie('accessToken', 'test-access-token');

    cy.visit('/'); // Переход на главную страницу приложения
    // cy.wait('@getIngredients'); // Ждем загрузки ингредиентов
  });

  afterEach(() => {
    cy.clearCookies(); // Очистка куки после каждого теста
    cy.clearLocalStorage(); // Очистка локального хранилища после каждого теста
  });

  it('Загрузка ингредиентов при запуске', () => {
    // Проверяем заголовок
    cy.contains('Соберите бургер').should('be.visible');

    // Проверяем категории
    cy.contains('Булки').should('be.visible');
    cy.contains('Начинки').should('be.visible');
    cy.contains('Соусы').should('be.visible');

    // Проверяем загрузку ингредиентов из фикстуры
    cy.fixture('ingredients.json').then(
      (ingredientData) => {
        // Проверяем несколько ключевых ингредиентов
        const keyIngredients = [
          'Флюоресцентная булка R2-D3',
          'Биокотлета из марсианской Магнолии',
          'Соус традиционный галактический'
        ];

        keyIngredients.forEach((ingredientName) => {
          cy.contains(ingredientName).should('exist');
        });
      }
    );
  });

  it('Добавление ингредиента из списка в конструктор', () => {
  // Дождаться загрузки ингредиентов
  cy.wait('@getIngredients');
  
  // Проверить пустой конструктор
  cy.get('[data-cy="constructor"]').within(() => {
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });

  // Добавляем  булку
    cy.contains('Флюоресцентная булка R2-D3')
      .closest('[data-cy="ingredient-item"]')
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

  // Проверить добавление булки
  cy.get('[data-cy="constructor-bun-top"]').should('exist');
  cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
  
  // Сообщение о выборе булок должно исчезнуть
  cy.get('[data-cy="constructor-empty-bun-top"]').should('not.exist');
  cy.get('[data-cy="constructor-empty-bun-bottom"]').should('not.exist');

  // Добавляем начинку
    cy.contains('Биокотлета из марсианской Магнолии')
      .closest('[data-cy="ingredient-item"]')
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

  // Проверить что начинка добавилась
  cy.get('[data-cy="constructor"]').within(() => {
    cy.contains('Выберите начинку').should('not.exist');
  });
});

  it('Процесс создания заказа', () => {
    // Проверяем что конструктор изначально пустой
    cy.get('[data-cy="constructor"]').within(() => {
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });

    // Добавляем конкретную булку
    cy.contains('Флюоресцентная булка R2-D3')
      .closest('[data-cy="ingredient-item"]')
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

    // Проверяем что добавилась именно она
    cy.get('[data-cy="constructor"]').within(() => {
      cy.contains(
        'Флюоресцентная булка R2-D3 (верх)'
      ).should('be.visible');
      cy.contains(
        'Флюоресцентная булка R2-D3 (низ)'
      ).should('be.visible');
      // Сообщение о пустом конструкторе пропало
      cy.contains('Выберите булки').should('not.exist');
    });

    // Добавляем конкретную начинку
    cy.contains('Биокотлета из марсианской Магнолии')
      .closest('[data-cy="ingredient-item"]')
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

    // Проверяем что добавилась именно она
    cy.get('[data-cy="constructor"]').within(() => {
      cy.contains(
        'Биокотлета из марсианской Магнолии'
      ).should('be.visible');
      cy.contains('Выберите начинку').should('not.exist');
    });

    // Добавляем соус
    cy.contains('Соус традиционный галактический')
      .closest('[data-cy="ingredient-item"]')
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

    // Проверяем что добавился именно он
    cy.get('[data-cy="constructor"]').within(() => {
      cy.contains('Соус традиционный галактический').should(
        'be.visible'
      );
    });

    // Проверяем кнопку оформления заказа
    cy.contains('button', 'Оформить заказ')
      .should('be.enabled') //кнопка активна
      .and('be.visible') //кнопка видима
      .click(); // кликаем на кнопку
    cy.wait('@postOrder'); // Ждем ответа от мокового сервера на создание заказа
    // Проверяем что появилось модальное окно с номером заказа
    cy.get('[data-cy="modal"]').within(() => {
      cy.contains('Ваш заказ начали готовить').should(
        'exist'
      );
      cy.contains('121212').should('exist'); // номер заказа из фикстуры
    });

    // Закрываем модальное окно
    cy.get('[data-cy="modal"]').within(() => {
      cy.get('[data-cy="modal-close"]').click();
    });

    // Проверяем что появились все плейсхолдеры пустого конструктора
    cy.get('[data-cy="constructor"]').within(() => {
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });

  describe('Открытие и закрытие модального окна с описанием ингредиента', () => {
    it('Открытие и закрытие модального окна', () => {
      // Кликаем на конкретный ингредиент
      cy.contains('Флюоресцентная булка R2-D3').click();

      // Проверяем наличие информации об ингредиенте
      cy.get('[data-cy="modal"]').within(() => {
        cy.contains('Состав ингредиента').should('exist');
        cy.contains('Калории').should('exist');
        cy.contains('Белки').should('exist');
        cy.contains('Жиры').should('exist');
        cy.contains('Углеводы').should('exist');
      });
    });

    it('Отображение в открытом модальном окне данных именно того ингредиента,по которому произошел клик', () => {
      cy.contains('Флюоресцентная булка R2-D3').click();

      // Проверяем что в модалке правильные данные
      cy.get('[data-cy="modal"]').within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should(
          'exist'
        );
        cy.contains('643').should('exist'); // калории
        cy.contains('44').should('exist'); // белки
        cy.contains('26').should('exist'); // жиры
        cy.contains('85').should('exist'); // углеводы
      });
    });

    it('Закрытие модального окна по кнопке закрытия', () => {
      // ОТКРЫВАЕМ модалку
      cy.contains('Флюоресцентная булка R2-D3').click();
      cy.get('[data-cy="modal"]').should('be.visible');

      // ЗАКРЫВАЕМ
      cy.get('[data-cy="modal"]').within(() => {
        cy.get('[data-cy="modal-close"]').click();
      });

      // ПРОВЕРЯЕМ
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('Закрытие модального окна по ESC', () => {
      // ОТКРЫВАЕМ модалку
      cy.contains('Флюоресцентная булка R2-D3').click();
      cy.get('[data-cy="modal"]').should('be.visible');

      // ЗАКРЫВАЕМ
      cy.get('body').type('{esc}');

      // ПРОВЕРЯЕМ
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      // ОТКРЫВАЕМ модалку
      cy.contains('Флюоресцентная булка R2-D3').click();
      cy.get('[data-cy="modal"]').should('be.visible');

      // ЗАКРЫВАЕМ
      cy.get('[data-cy="modal-overlay"]').click({
        force: true
      });
      // ПРОВЕРЯЕМ
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });
});
