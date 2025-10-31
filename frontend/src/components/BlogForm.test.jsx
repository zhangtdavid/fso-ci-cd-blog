import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { beforeEach } from 'vitest'

test('<BlogForm />', async () => {
  const handleCreate = vi.fn()
  const user = userEvent.setup()

  const container = render(<BlogForm createBlog={handleCreate} />).container

  const newTitle = 'newTitle'
  const newAuthor = 'newAuthor'
  const newUrl = 'newUrl'

  await user.type(container.querySelector('#blog-title'), newTitle)
  await user.type(container.querySelector('#blog-author'), newAuthor)
  await user.type(container.querySelector('#blog-url'), newUrl)
  await user.click(screen.getByText('create'))

  expect(handleCreate.mock.calls).toHaveLength(1)
  expect(handleCreate.mock.calls[0][0]).equals(newTitle)
  expect(handleCreate.mock.calls[0][1]).equals(newAuthor)
  expect(handleCreate.mock.calls[0][2]).equals(newUrl)
})