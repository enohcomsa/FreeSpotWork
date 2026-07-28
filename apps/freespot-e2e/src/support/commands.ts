/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(): void;
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', () => {
  cy.intercept('POST', '**/auth/login').as('login');

  cy.visit('/auth');
  cy.get('[data-automation-id="login-identifier"]').click();
  cy.get('[data-automation-id="login-identifier"]').type('student@test.com');
  cy.get('[data-automation-id="login-password"]').type('Password123!');
  cy.get('[data-automation-id="login-submit"]').click();
  cy.wait('@login').its('response.statusCode').should('eq', 200);
  cy.location('pathname').should('eq', '/home');
  cy.getCookie('access_token').its('value').should('not.be.empty');
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
