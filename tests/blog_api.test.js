const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/list_helper')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})
beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('pass', 10)
  const user = new User({
    username: 'john',
    blogs: '5a422a851b54a676234d17f7',
    passwordHash
  })
  await user.save()
})

test('blogs are returned as JSON', async () => {
  const user = {
    username: 'john',
    password: 'pass'
  }
  const response = await api.post('/api/login').send(user)
  const token = await response.body.token
  await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('all blogs are returned', async () => {
  const user = {
    username: 'john',
    password: 'pass'
  }
  const responseUser = await api.post('/api/login').send(user)
  const token = await responseUser.body.token
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier is named id', async () => {
  const user = {
    username: 'john',
    password: 'pass'
  }
  const responseUser = await api.post('/api/login').send(user)
  const token = await responseUser.body.token
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

test('post request creates a new blog post', async () => {
  const user = {
    username: 'john',
    password: 'pass'
  }
  const response = await api.post('/api/login').send(user)
  const token = await response.body.token
  const newBlog = {
    title: 'Architecture in web',
    author: 'Robert',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    user: user.id,
    likes: 5
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const title = blogsAtEnd.map((blog) => blog.title)
  expect(title).toContain('Architecture in web')
})

test('if likes is missing defaluts to 0', async () => {
  const user = {
    username: 'john',
    password: 'pass'
  }
  const responseUser = await api.post('/api/login').send(user)
  const token = await responseUser.body.token
  const newBlog = {
    title: 'Architecture in web',
    author: 'Robert',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  const lastBlog = blogsAtEnd[helper.initialBlogs.length]
  expect(lastBlog.likes).toBe(0)
})
test('backend responds with code 400 if the title is missing', async () => {
  const user = {
    username: 'john',
    password: 'pass'
  }
  const responseUser = await api.post('/api/login').send(user)
  const token = await responseUser.body.token
  const newBlog = {
    author: 'Robert',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 5
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})
test('backend responds with code 400 if the url is missing', async () => {
  const user = {
    username: 'john',
    password: 'pass'
  }
  const responseUser = await api.post('/api/login').send(user)
  const token = await responseUser.body.token
  const newBlog = {
    author: 'Robert',
    title: 'Good web development'
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})
test('a blog can be deleted', async () => {
  const user = {
    username: 'john',
    password: 'pass'
  }
  const responseUser = await api.post('/api/login').send(user)
  const token = await responseUser.body.token

  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  const titles = blogsAtEnd.map((blog) => blog.title)
  expect(titles).not.toContain(blogToDelete.title)

  expect()
})
test('a blog can be updated', async () => {
  const user = {
    username: 'john',
    password: 'pass'
  }
  const responseUser = await api.post('/api/login').send(user)
  const token = await responseUser.body.token
  const blogAtStart = await helper.blogsInDb()
  const blogtoUpdate = blogAtStart[0]
  const updatedBlogData = {
    title: blogtoUpdate.title,
    author: blogtoUpdate.author,
    url: blogtoUpdate.url,
    likes: blogtoUpdate.likes + 1
  }
  await api
    .put(`/api/blogs/${blogtoUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlogData)
    .expect(204)
  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd[0]
  expect(updatedBlog.likes).toBe(blogtoUpdate.likes + 1)
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('pass', 10)
    const user = new User({
      username: 'root',
      passwordHash
    })
    await user.save()
  })
  test('creation succeds with a fresh user name', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'sams',
      name: 'Samson',
      password: 'pass'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map((user) => user.username)
    expect(usernames).toContain(newUser.username)
  })
  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'sams',
      name: 'Samson',
      password: 'pa'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain(
      'password length must be at least 3 characters'
    )
    const userAtEnd = await helper.usersInDb()
    expect(userAtEnd).toHaveLength(usersAtStart.length)
    expect(userAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    // .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
