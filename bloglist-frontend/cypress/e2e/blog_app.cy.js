describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('Login to Application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })
})
