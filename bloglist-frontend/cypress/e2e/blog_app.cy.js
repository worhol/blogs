describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const userJohn = {
      username: 'john',
      name: 'John',
      password: 'pass'
    }
    const userTester = {
      username: 'test',
      name: 'Tester',
      password: 'pass'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, userJohn)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, userTester)
    cy.visit('')
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
      cy.login({ username: 'john', password: 'pass' })
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
    it('users can like a blog', function () {
      cy.contains('new blog').click()
      cy.get("[placeholder='title']").type('Test Title')
      cy.get("[placeholder='author']").type('Test Author')
      cy.get("[placeholder='url']").type('www.url.com')
      cy.contains('create').click()
      cy.get('#blog').contains('view').click()
      cy.contains('like').click()
      cy.contains('1')
    })

    it('user who created a blog can delete it', function () {
      cy.login({ username: 'john', password: 'pass' })
      cy.createBlog({
        title: 'New Title',
        author: 'New Author',
        url: 'www.newurl.com'
      })
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'Test Title Test Author')
    })
    it('only the creator can see the delete button of a blog, not anyone else', function () {
      cy.login({ username: 'john', password: 'pass' })
      cy.createBlog({
        title: 'New Title',
        author: 'New Author',
        url: 'www.newurl.com'
      })
      cy.contains('view').click()
      cy.contains('remove')
      cy.contains('logout').click()
      cy.login({ username: 'test', password: 'pass' })
      cy.contains('view').click()
      cy.should('not.contain', 'remove')
    })
    it.only('blogs are ordered according to likes with the blog with the most likes being first', function () {
      cy.contains('new blog').click()
      cy.createBlog({
        title: 'Title with least likes',
        author: 'New Author',
        url: 'www.newurl.com',
        likes: 2
      })
      cy.createBlog({
        title: 'New Title',
        author: 'New Author',
        url: 'www.newurl.com',
        likes: 5
      })
      cy.createBlog({
        title: 'Title with most likes',
        author: 'New Author',
        url: 'www.newurl.com',
        likes: 9
      })
      cy.log(cy.get('#blog').eq(0))
      cy.get('#blog').eq(0).should('contain', 'Title with most likes')
    })
  })
})
