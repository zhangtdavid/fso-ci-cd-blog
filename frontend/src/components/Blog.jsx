import Togglable from './Togglable'

const Blog = ({ blog, handleLike, handleDelete }) => (
  <div className='blog'>
    {blog.title} {blog.author}
    <Togglable buttonLabel='view' cancelLabel='hide'>
      <p>{blog.url}</p>
      <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
      <p>{blog.user.name}</p>
      { handleDelete ? <div><button onClick={() => handleDelete(blog)}>remove</button><br /><br /></div> : null }
    </Togglable>
  </div>
)

export default Blog