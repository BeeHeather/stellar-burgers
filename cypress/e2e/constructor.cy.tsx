/// <reference types="cypress" />

import ingredients from '../fixtures/ingredients.json';
import orderResponse from '../fixtures/orderResponse.json';
import user from '../fixtures/user.json';

describe('Конструктор бургера', () => {
  const selectors = {
    ingredientBun: '[data-cy=ingredient-643d69a5c3f7b9001cfa093c]',
    ingredientMain: '[data-cy=ingredient-643d69a5c3f7b9001cfa093e]',

    constructor: '[data-cy=constructor]',
    constructorBunTop: '[data-cy=constructor-bun-top]',
    constructorBunBottom: '[data-cy=constructor-bun-bottom]',
    constructorIngredientsList: '[data-cy=constructor-ingredients-list]',
    constructorItem: '[data-cy=constructor-item-643d69a5c3f7b9001cfa093e]',

    modal: '[data-cy=modal]',
    modalCloseButton: '[data-cy=modal-close-button]',
    orderButton: '[data-cy=order-button]'
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      body: ingredients
    }).as('getIngredients');

    cy.visit('');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('Добавление булки в конструктор', () => {
      cy.get(selectors.ingredientBun).find('button').click();

      cy.get(selectors.constructorBunTop).should('exist');
      cy.get(selectors.constructorBunBottom).should('exist');
    });

    it('Добавление начинки в конструктор', () => {
      cy.get(selectors.ingredientMain).find('button').click();

      cy.get(selectors.constructorIngredientsList)
        .find(selectors.constructorItem)
        .should('exist');
    });
  });

  describe('Тестирование модальных окон', () => {
    it('Открытие модального окна ингредиента', () => {
      cy.get(selectors.ingredientBun).click();
      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.modal).should('contain', 'Краторная булка N-200i');
    });

    it('Закрытие модального окна по клику на крестик', () => {
      cy.get(selectors.ingredientBun).click();
      cy.get(selectors.modal).should('be.visible');

      cy.get(selectors.modalCloseButton).click();
      cy.get(selectors.modal).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/auth/user', {
        statusCode: 200,
        body: user
      }).as('getUser');

      cy.intercept('POST', '**/api/orders', {
        statusCode: 200,
        body: orderResponse
      }).as('createOrder');

      cy.setCookie('accessToken', 'test-access-token');
      cy.setCookie('refreshToken', 'test-refresh-token');
      window.localStorage.setItem('accessToken', 'test-access-token');
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.clearCookie('refreshToken');
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
    });

    it('создание заказа с проверкой всех этапов', () => {
      cy.get(selectors.ingredientBun).find('button').click();
      cy.get(selectors.ingredientMain).find('button').click();

      cy.get(selectors.orderButton).click();
      cy.wait('@createOrder');

      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.modalCloseButton).click();
      cy.get(selectors.modal).should('not.exist');

      cy.get(selectors.constructor).should('contain', 'Выберите булки');
    });
  });
});
