import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  /// method getByPlaceholder , used to access the inpu feilds
  //const input = screen.getByRole('textbox')
// there s also : getByLabelText , getAllByRole , getByRole
const input = screen.getByPlaceholderText('write note content here')
/// or we could use this methos as well with the id , from the Note components
// const { container } = render(<NoteForm createNote={createNote} />)
// const input = container.querySelector('#note-input')

  const sendButton = screen.getByText('save')

  // typing in input feild using userEvent module
  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  // checking wether we called first to get an idea
  console.log(createNote.mock.calls)
  // checking that the form submission actually calls the method createNote 
  expect(createNote.mock.calls).toHaveLength(1)
  // checking that we called the method with the right params
  // ie : that the note was creted with the correct content
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})