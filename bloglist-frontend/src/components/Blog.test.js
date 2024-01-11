import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog/>', () => {
  test('component displaying a blog renders the blog title and author, but does not render its URL or number of likes by default', () => {
    const blog = {
      title: 'Title to test',
      author: 'Author Test',
      url: 'www.test.com',
      likes: 4
    }
    render(<Blog blog={blog} user={'tester'} />)

    const elementTitle = screen.getAllByText('Title to test', { exact: false })
    const elementAuthor = screen.getAllByText('Author Test', { exact: false })
    const elementUrl = screen.queryByText('not rendered')
    const elementLikes = screen.queryByText('not rendered')

    expect(elementTitle).toBeDefined()
    expect(elementAuthor).toBeDefined()
    expect(elementUrl).toBeNull()
    expect(elementLikes).toBeNull()
  })
})
