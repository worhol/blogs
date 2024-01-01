const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1
  })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    user: user.id,
    likes: body.likes || 0
  })
  if (body.title && body.url) {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } else {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  const blogId = request.params.id
  if (user.blogs.includes(blogId)) {
    await Blog.findByIdAndDelete(blogId)
    user.blogs = user.blogs.filter((id) => id.toString() !== blogId)
    await user.save()
    response.status(204).end()
  } else {
    return response.status(401).json({
      error: 'unauthorized action. blog to be deleted does not belong to you'
    })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true
  })
  response.status(204).json(updatedBlog)
})

module.exports = blogsRouter
