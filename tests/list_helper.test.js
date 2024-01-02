const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const emptyList = []

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listHelper.initialBlogs)
    expect(result).toBe(36)
  })
})

test('favorite blog', () => {
  const result = listHelper.favoriteBlog(listHelper.initialBlogs)
  expect(result).toEqual({
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12
  })
})
test('favorite author', () => {
  const result = listHelper.mostBlogs(listHelper.initialBlogs)
  expect(result).toEqual({
    author: 'Robert C. Martin',
    blogs: 3
  })
})

test('most liked author', () => {
  const result = listHelper.mostLikes(listHelper.initialBlogs)
  expect(result).toEqual({
    author: 'Edsger W. Dijkstra',
    likes: 17
  })
})
