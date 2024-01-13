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
  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('john')
      cy.get('#password').type('pass')
      cy.get('#login').click()
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get("[placeholder='title']").type('Test Title')
      cy.get("[placeholder='author']").type('Test Author')
      cy.get("[placeholder='url']").type('www.url.com')
      cy.contains('create').click()
      cy.get('.success').contains(
        'Blog Test Title by Test Author added succesfully'
      )
      cy.get('#blog').contains('Test Title Test Author')
    })
    it('users can like a blog', function(){
      cy.contains('new blog').click()
      cy.get("[placeholder='title']").type('Test Title')
      cy.get("[placeholder='author']").type('Test Author')
      cy.get("[placeholder='url']").type('www.url.com')
      cy.contains('create').click()
      cy.get('#blog').contains('view').click()
      cy.contains('like').click()
      cy.contains('1')
    })
  })
})
