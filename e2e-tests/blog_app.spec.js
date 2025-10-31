const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require ('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'David Zhang',
        username: 'dzhang',
        password: 'passwordnotcommon'
      }
    })
    await page.goto('/')
  })

  test ('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credenetials', async ({ page }) => {
      await loginWith(page, 'dzhang', 'passwordnotcommon')
    })

    test('fails with wrong credenetials', async ({ page }) => {
      await loginWith(page, 'dzhang', 'wrong')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'dzhang', 'passwordnotcommon')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'New Blog Title', 'New Blog Author', 'New Blog URL')
      await expect(page.getByText('New Blog Title New Blog Author')).toBeVisible()
    })

    test('a new blog can be liked', async ({ page }) => {
      await createBlog(page, 'New Blog Title', 'New Blog Author', 'New Blog URL')
      const blogText = await page.getByText('New Blog Title New Blog Author')
      const blogElement = await blogText.locator('..')

      await blogElement.getByRole('button', { name: 'view' }).click()
      await blogElement.getByRole('button', { name: 'like' }).click()
      await expect(blogElement.getByText('likes 1')).toBeVisible()
    })

    test('a new blog can be deleted', async ({ page }) => {
      await createBlog(page, 'New Blog Title', 'New Blog Author', 'New Blog URL')
      const blogText = await page.getByText('New Blog Title New Blog Author')
      const blogElement = await blogText.locator('..')

      await blogElement.getByRole('button', { name: 'view' }).click()

      page.on('dialog', async dialog => {
        dialog.accept()
      })
      await blogElement.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('New Blog Title New Blog Author')).not.toBeVisible()
    })

    test('a new blog cannot be deleted by another user', async ({ page, request }) => {
      await createBlog(page, 'New Blog Title', 'New Blog Author', 'New Blog URL')
      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('/api/users', {
        data: {
          name: 'David Zhang2',
          username: 'dzhang2',
          password: 'passwordnotcommon2'
        }
      })
      await loginWith(page, 'dzhang2', 'passwordnotcommon2')

      const blogText = await page.getByText('New Blog Title New Blog Author')
      const blogElement = await blogText.locator('..')
      await expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered in descending number of likes', async ({ page }) => {
      await createBlog(page, 'Title1Likes', 'Author1Likes', 'URL1Likes')
      const blog1likesText = await page.getByText('Title1Likes Author1Likes')
      const blog1likesElement = await blog1likesText.locator('..')

      await blog1likesElement.getByRole('button', { name: 'view' }).click()
      await blog1likesElement.getByRole('button', { name: 'like' }).click()

      await createBlog(page, 'Title2Likes', 'Author2Likes', 'URL2Likes')
      const blog2likesText = await page.getByText('Title2Likes Author2Likes')
      const blog2likesElement = await blog2likesText.locator('..')

      await blog2likesElement.getByRole('button', { name: 'view' }).click()
      const blog2likesButton = await page.locator('p').filter({ hasText: 'likes 0 like' }).getByRole('button')
      await blog2likesButton.click()
      await blog2likesButton.click()

      await page.reload()

      const blog2likesElementReload = await page.getByText('Title2Likes Author2Likes').elementHandle()
      const blog1likesElementReload = await page.getByText('Title1Likes Author1Likes').elementHandle()

      const isABeforeB = await page.evaluate(([a, b]) => {
        return Promise.resolve(a.compareDocumentPosition(b))
      }, [blog2likesElementReload, blog1likesElementReload])

      expect(isABeforeB).toBeTruthy()
    })
  })
})