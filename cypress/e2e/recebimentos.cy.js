/// <reference types="cypress" />

describe('Recebimento - FlowData', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3001/login')
  })

    it(' Deve cadastrar e concluir recebimento com sucesso ', () => {  
        cy.get('#login-email-input',{timeout:10000}).type('admin@flowdata.com');
        cy.get('#login-pass-input').type('2025@flow');
        cy.get('#login-save-button').click(); 
        cy.get('.mdi-menu').click();
        cy.get('#v-list-group--id-Estoque').click();
        cy.get('[href="/stock/checking"]').click();
        cy.get('#stock-create-button').click();
        cy.get('#stock-codpro-input').click().type('123456');
        cy.get('#stock-prod-confirm-button').click();
        cy.get('#stock-received-qty-input').click().type(22);
        cy.get('#stock-crete-line-button > .v-btn__content').click();
        cy.get('#stock-end-button').click();
        cy.get('#stock-conclude-checking-button').click();
        cy.get('.v-card-item').should('contain', 'Recebimento concluído');
      })

  it(' Deve gerar um erro ao ter um recebimento vazio ', () => {  
    cy.get('#login-email-input',{timeout:10000}).type('admin@flowdata.com');
        cy.get('#login-pass-input').type('2025@flow');
        cy.get('#login-save-button').click(); 
        cy.get('.mdi-menu').click();
        cy.get('#v-list-group--id-Estoque').click();
        cy.get('[href="/stock/checking"]').click();
        cy.get('#stock-create-button').click();
        cy.get('#stock-codpro-input').click().type('');
        cy.get('#stock-prod-confirm-button').click();
        cy.get('#stock-received-qty-input').click().type(80);
        cy.get('#stock-crete-line-button > .v-btn__content').click();
      })
})
