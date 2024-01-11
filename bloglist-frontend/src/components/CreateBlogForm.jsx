import PropTypes from 'prop-types'
const CreateBlogForm = ({
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url
}) => {
  return (
    <div>
      <h2>Create new Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            placeholder='title'
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            placeholder='author'
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            placeholder='url'
            onChange={handleUrlChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

CreateBlogForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleAuthorChange: PropTypes.func.isRequired,
  handleUrlChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}

export default CreateBlogForm
