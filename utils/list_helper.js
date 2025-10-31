const lodash = require('lodash')

const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, cur) => {
    return prev.likes > cur.likes ? prev : cur
  }

  if (blogs.length === 0) {
    return null
  }

  const blog = blogs.reduce(reducer)
  delete blog._id
  delete blog.url
  delete blog.__v

  return blog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const groupedBlogs = lodash.groupBy(blogs, (blog) => { return blog.author })
  const groupedBlogsCount = lodash.mapValues(groupedBlogs, (blogs) => { return blogs.length })
  const reducer = (prev, cur) => {
    return prev[1] > cur[1] ? prev : cur
  }
  const reducedMostBlogs = Object.entries(groupedBlogsCount).reduce(reducer)

  return { author: reducedMostBlogs[0], blogs: reducedMostBlogs[1] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const groupedBlogs = lodash.groupBy(blogs, (blog) => { return blog.author })
  const groupedBlogsCount = lodash.mapValues(groupedBlogs, (blogs) => { return blogs.reduce((sum, blog) => { return sum + blog.likes }, 0)})
  const reducer = (prev, cur) => {
    return prev[1] > cur[1] ? prev : cur
  }
  const reducedMostLikes = Object.entries(groupedBlogsCount).reduce(reducer)

  return { author: reducedMostLikes[0], likes: reducedMostLikes[1] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}