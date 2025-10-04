/// <reference types="cypress" />

describe('Tela de Login - FlowData', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3001/login')
  })

   it('Deve permitir realizar o login com credenciais válidas', () => {  
        cy.get('#login-email-input',{timeout:10000}).type('admin@flowdata.com');
        cy.get('#login-pass-input').type('2025@flow');
        cy.get('#login-save-button').click(); 
})
})
