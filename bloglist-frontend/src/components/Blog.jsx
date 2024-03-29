import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const userName = blog.user?.name || user.name

  const showRemoveButton = {
    display: blog.user?.username === user.username ? 'block' : 'none'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div id='blog'style={blogStyle}>
      <div  style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button> <br />
        <a href={blog.url}>{blog.url}</a> <br />
        {blog.likes} <button onClick={handleLike}>like</button>
        <br />
        {userName}
        <div style={showRemoveButton}>
          <button onClick={handleRemove}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
