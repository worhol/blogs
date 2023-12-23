// const _ = require('lodash')

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

// const mostBlogs = (blogposts) => {
//   const authorArray = _.countBy(blogposts, blogposts.author)
//   console.log(authorArray[0])
// }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
