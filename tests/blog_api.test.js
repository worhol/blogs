const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/list_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

test('post request creates a new blog post', async () => {
  const newBlog = {
    title: 'Architecture in web',
    author: 'Robert',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 5
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const title = blogsAtEnd.map((blog) => blog.title)
  expect(title).toContain('Architecture in web')
})

test('if likes is missing defaluts to 0', async () => {
  const newBlog = {
    title: 'Architecture in web',
    author: 'Robert',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
  }
  await api.post('/api/blogs').send(newBlog).expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  const lastBlog = blogsAtEnd[helper.initialBlogs.length]
  expect(lastBlog.likes).toBe(0)
})
test('backend responds with code 400 if the title is missing', async () => {
  const newBlog = {
    author: 'Robert',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 5
  }
  await api.post('/api/blogs').send(newBlog).expect(400)
})
test('backend responds with code 400 if the url is missing', async () => {
  const newBlog = {
    author: 'Robert',
    title: 'Good web development'
  }
  await api.post('/api/blogs').send(newBlog).expect(400)
})
test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  const titles = blogsAtEnd.map((blog) => blog.title)
  expect(titles).not.toContain(blogToDelete.title)

  expect()
})
test('a blog can be updated', async () => {
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
    .send(updatedBlogData)
    .expect(204)
  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd[0]
  expect(updatedBlog.likes).toBe(blogtoUpdate.likes + 1)
})
afterAll(async () => {
  await mongoose.connection.close()
})
