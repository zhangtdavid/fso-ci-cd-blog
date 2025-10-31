import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach } from 'vitest'

describe('<Blog />', () => {
  const handleLike = vi.fn()
  const blog = {
    title: 'Another One',
    author: 'DJ Khaled',
    url: 'www.wethebestmusic.com',
    likes: 23,
    user: {
      username: 'hellas',
      name: 'Arto Hellas',
      id: '6668a5915b87608ca6d74ae4'
    },
    id: '6668aa53f2cbf78ba7a55a16'
  }
  let container

  beforeEach(() => {
    container = render(<Blog blog={blog} handleLike={handleLike}></Blog>).container
  })

  test('Default only renders title and author', () => {
    const title = screen.getByText(blog.title, { exact: false })
    expect(title).toBeVisible()
    const author = screen.getByText(blog.author, { exact: false })
    expect(author).toBeVisible()
    const likes = screen.getByText('likes', { exact: false })
    expect(likes).not.toBeVisible()
    const url = screen.getByText(blog.url, { exact: false })
    expect(url).not.toBeVisible()
  })

  test('Likes and URL are visible after clicking the view button', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likes = screen.getByText('likes', { exact: false })
    expect(likes).toBeVisible()
    const url = screen.getByText(blog.url, { exact: false })
    expect(url).toBeVisible()
  })

  test('Clicking like twice is handled properly', async () => {
    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleLike.mock.calls).toHaveLength(2)
  })
})