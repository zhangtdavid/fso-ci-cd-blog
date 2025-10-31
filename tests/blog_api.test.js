const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require ('../app')

const api = supertest(app)

let userToken = null

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  const userLogin = {
    username: 'root',
    password: 'sekret',
  }

  const response = await api
    .post('/api/login')
    .send(userLogin)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  userToken = response.body.token
})

describe('blog api', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('each blog has a unique identifier property named id', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body.every((blog) => 'id' in blog))

    const uniqueIds = new Set(response.body.map((blog) => blog.id))
    assert(uniqueIds.size === response.body.length)
  })

  describe('addition of a new blog', () => {

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Another One',
        author: 'DJ Khaled',
        url: 'www.wethebestmusic.com',
        likes: 9,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const lastBlog = blogsAtEnd.at(-1)
      delete lastBlog.id
      delete lastBlog.user
      assert.deepStrictEqual(lastBlog, newBlog)
    })

    test('a blog with no likes initializes its likes to 0', async () => {
      const newBlog = {
        title: 'Another One',
        author: 'DJ Khaled',
        url: 'www.wethebestmusic.com',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const lastBlog = blogsAtEnd.at(-1)
      assert.strictEqual(lastBlog.likes, 0)
    })

    test('blog without title is not added', async () => {
      const newBlog = {
        author: 'DJ Khaled',
        url: 'www.wethebestmusic.com',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without URL is not added', async () => {
      const newBlog = {
        title: 'Another One',
        author: 'DJ Khaled',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of blog', () => {
    let newBlogId = null

    beforeEach(async () => {
      const newBlog = {
        title: 'Another One',
        author: 'DJ Khaled',
        url: 'www.wethebestmusic.com',
        likes: 9,
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      newBlogId = response.body.id
    })

    test('succeeds with status code 204 if id is valid', async () => {
      await api
        .delete(`/api/blogs/${newBlogId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert(!blogsAtEnd.includes(blog => blog.id === newBlogId))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('returns status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400)
    })
  })

  describe('updating a blog', () => {

    test('succeeds with status code 200 if updated content is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        ...blogToUpdate,
        likes: 50,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd[0].likes, updatedBlog.likes)
    })

    test('returns status code 400 if updated content is invalid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: '',
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})