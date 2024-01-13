describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'john',
      name: 'John',
      password: 'pass'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('Login to Application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('john')
      cy.get('#password').type('pass')
      cy.get('#login').click()
      cy.contains('John logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('john')
      cy.get('#password').type('passw')
      cy.get('#login').click()
      cy.get('.error')
        .contains('invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})
