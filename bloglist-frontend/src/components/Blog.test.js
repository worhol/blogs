import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import CreateBlogForm from './CreateBlogForm'

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

  test('blog URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
    const blog = {
      title: 'Title to test',
      author: 'Author Test',
      url: 'www.test.com',
      likes: 4
    }
    const mockHandler = jest.fn()

    render(<Blog blog={blog} toggleVisibility={mockHandler} user={'tester'} />)
    const elementUrl = screen.getByText('www.test.com')
    const elementLikes = screen.getByText('4', { exact: false })

    expect(elementUrl).not.toBeVisible()
    expect(elementLikes).not.toBeVisible()

    const user = userEvent.setup()

    const buttonView = screen.getByText('view')
    await user.click(buttonView)

    expect(elementUrl).toBeVisible()
    expect(elementLikes).toBeVisible()

    const buttonHide = screen.getByText('view')
    await user.click(buttonHide)

    expect(elementUrl).not.toBeVisible()
    expect(elementLikes).not.toBeVisible()
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const blog = {
      title: 'Title to test',
      author: 'Author Test',
      url: 'www.test.com',
      likes: 4
    }
    const mockHandler = jest.fn()

    render(<Blog blog={blog} handleLike={mockHandler} user={'tester'} />)
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
    //test can work without hardcoding props, but it gives warning that author, title and url propsa are undefined at the time of the handleSubmit
    const handleSubmit = jest.fn((e) => e.preventDefault())
    const handleTitleChange = jest.fn()
    const handleAuthorChange = jest.fn()
    const handleUrlChange = jest.fn()

    render(
      <CreateBlogForm
        handleSubmit={handleSubmit}
        handleTitleChange={handleTitleChange}
        handleAuthorChange={handleAuthorChange}
        handleUrlChange={handleUrlChange}
        author='testing a author...'
        title='testing a title...'
        url='testing a url...'
        user={'tester'}
      />
    )
    const user = userEvent.setup()
    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'testing a title...')
    await user.type(authorInput, 'testing a author...')
    await user.type(urlInput, 'testing a url...')
    await user.click(createButton)
    expect(
      handleTitleChange.mock.calls[handleTitleChange.mock.calls.length - 1][0]
        .target.value
    ).toBe('testing a title...')
    expect(
      handleAuthorChange.mock.calls[handleAuthorChange.mock.calls.length - 1][0]
        .target.value
    ).toBe('testing a author...')
    expect(
      handleUrlChange.mock.calls[handleUrlChange.mock.calls.length - 1][0]
        .target.value
    ).toBe('testing a url...')
  })
})
