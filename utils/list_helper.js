const _ = require('lodash')

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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
