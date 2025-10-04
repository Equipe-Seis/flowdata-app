describe('Recebimento ', () => {

  beforeEach(() => {
    cy.visit('/http://localhost:3001/stock/checking')
  })

  it('Cenário 1: Concluir recebimento com sucesso', () => {
    cy.get('#input-v-0-12').first().click()



})
