const _ = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const dummy = (blogs) => {
  if (blogs) {
    return 1
  }
}
const totalLikes = (blogposts) => {
  const reducer = (sum, blogposts) => {
    return sum + blogposts.likes
  }
  return blogposts.length === 0 ? 0 : blogposts.reduce(reducer, 0)
}
const favoriteBlog = (blogposts) => {
  const likesArray = blogposts.map((post) => post.likes)
  const mostLikes = Math.max(...likesArray)
  const findFavorite = blogposts.filter((post) => post.likes === mostLikes)
  const result = {
    title: findFavorite[0].title,
    author: findFavorite[0].author,
    likes: findFavorite[0].likes
  }
  return result
}

const mostBlogs = (blogposts) => {
  const authorArray = blogposts.map((post) => post.author)
  const mostBlogs = _.countBy(authorArray)
  const maxAuthor = _.maxBy(_.toPairs(mostBlogs), ([, count]) => count)
  const author = {
    author: maxAuthor[0],
    blogs: maxAuthor[1]
  }
  return author
}

const mostLikes = (blogposts) => {
  const authorArray = blogposts.map((post) => [post.author, post.likes])
  const authorLikes = _.groupBy(authorArray, 0)
  const sumByName = _.mapValues(authorLikes, (values) => _.sumBy(values, 1))
  const maxAuthor = _.maxBy(_.toPairs(sumByName), ([, count]) => count)
  const author = {
    author: maxAuthor[0],
    likes: maxAuthor[1]
  }
  return author
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  usersInDb
}
