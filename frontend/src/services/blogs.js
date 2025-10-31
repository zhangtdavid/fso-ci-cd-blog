import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createNewBlog = async (newBlogTitle, newBlogAuthor, newBlogUrl) => {
  const config = {
    headers: { Authorization: token }
  }

  const newBlog = {
    'title': newBlogTitle,
    'author': newBlogAuthor,
    'url': newBlogUrl
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const editBlog = async (editedBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${editedBlog.id}`, editedBlog, config)
  return response.data
}

const deleteBlog = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

export default { getAll, setToken, createNewBlog, editBlog, deleteBlog }