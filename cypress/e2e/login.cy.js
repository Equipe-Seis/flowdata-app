/// <reference types="cypress" />

describe('Tela de Login - FlowData', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

   it('Deve permitir realizar o login com credenciais válidas', () => {  
        cy.get('[data-cy="email-input"]').type('admin@teste.com');
        cy.get('[data-cy="email-input"]').should('have.value', 'admin@teste.com');
        cy.get('[data-cy="password-input"]').type('123456');
        cy.get('[data-cy="password-input"]').should('have.value', '123456');
        cy.get('[data-cy="button-login"]').click(); 
})
})
