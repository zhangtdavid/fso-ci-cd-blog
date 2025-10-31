import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addNewBlog = (event) => {
    event.preventDefault()
    createBlog(newBlogTitle, newBlogAuthor, newBlogUrl)

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <div>
      <h1>create new</h1>
      <form onSubmit={addNewBlog}>
        <div>
          title:
          <input
            type="text"
            value={newBlogTitle}
            name="newBlogTitle"
            onChange={({ target }) => setNewBlogTitle(target.value)}
            id='blog-title'
            data-testid='blog-title'
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={newBlogAuthor}
            name="newBlogAuthor"
            onChange={({ target }) => setNewBlogAuthor(target.value)}
            id='blog-author'
            data-testid='blog-author'
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={newBlogUrl}
            name="newBlogUrl"
            onChange={({ target }) => setNewBlogUrl(target.value)}
            id='blog-url'
            data-testid='blog-url'
          />
        </div>
        <button type="create">create</button>
      </form>
    </div>
  )
}

export default BlogForm