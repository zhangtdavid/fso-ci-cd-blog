import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [statusMessage, setStatusMessage] = useState(null)
  const [statusClass, setStatusClass] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

      setStatusMessage(null)
    } catch (exception) {
      setStatusMessage('Wrong credentials')
      setStatusClass('error')
      setTimeout(() => {
        setStatusMessage(null)
      }, 5000)
    } finally {
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setStatusMessage(null)
  }

  const loginForm = () => (
    <div>
      <h1>log in to application</h1>
      <Notification message={statusMessage} displayClass={statusClass} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="username"
            data-testid='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="password"
            data-testid='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const handleCreateNewBlog = async (title, author, url) => {
    try {
      newBlogFormRef.current.toggleVisibility()
      await blogService.createNewBlog(title, author, url)

      await blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )

      setStatusClass('success')
      setStatusMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
        setStatusMessage(null)
      }, 5000)
    } catch (exception) {
      setStatusMessage(exception.response.data.error)
      setStatusClass('error')
      setTimeout(() => {
        setStatusMessage(null)
      }, 5000)
    }
  }

  const handleLike = async (blog) => {
    try {
      const editedBlog = blog
      editedBlog.likes += 1
      await blogService.editBlog(editedBlog)

      await blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
    } catch (exception) {
      console.error(exception)
    }
  }

  const handleDelete = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.deleteBlog(blog)

        await blogService.getAll().then(blogs =>
          setBlogs(blogs)
        )
      }
    } catch (exception) {
      setStatusMessage(exception.response.data.error)
      setStatusClass('error')
      setTimeout(() => {
        setStatusMessage(null)
      }, 5000)
    }
  }

  const newBlogFormRef = useRef()

  const blogList = () => (
    <div>
      <h1>blogs</h1>
      <Notification message={statusMessage} displayClass={statusClass} />
      <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel='new blog' ref={newBlogFormRef}>
        <BlogForm createBlog={handleCreateNewBlog} />
      </Togglable>
      <div>
        {blogs.sort((lhs, rhs) => { return lhs.likes > rhs.likes ? -1 : 1 }).map(blog =>
          <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={blog.user.username === user.username ? handleDelete : null} />
        )}
      </div>
    </div>
  )

  return user === null ?
    loginForm() :
    blogList()
}

export default App