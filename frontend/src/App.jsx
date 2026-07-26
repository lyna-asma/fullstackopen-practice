import { useState, useEffect } from 'react'
import noteService from './services/notes'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useMatch
} from 'react-router-dom'
import NoteList from './components/NoteList'
import Home from './components/Home'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'
import Note from './components/Note'
import Notification from './components/Notification';

const App = () => {
  const [notes, setNotes] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  // checking the note that has that id , to pass it to the Note component
  // every time the url change sthis is executed
  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === match.params.id)
    : null

  const addNote = noteObject => {
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNotification({ text: `Note '${returnedNote.content}' added!`, type: 'success' })
    })
  }

  // ADD toggleImportanceOf function
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(() => {
        alert(`Note '${note.content}' was already removed from server`)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const padding = {
    padding: 5
  }
const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }
  return (
    <Container>

      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={style}>
            home
          </Button>
          <Button color="inherit" component={Link} to="/notes" sx={style}>
            notes
          </Button>
          <Button color="inherit" component={Link} to="/create" sx={style}>
            new note
          </Button>
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route path="/notes/:id" element={
          <Note
            note={note}
            toggleImportanceOf={toggleImportanceOf}
            deleteNote={deleteNote}
          />
        } />
        <Route path="/notes" element={
          <NoteList notes={notes} setNotification={setNotification} />
        } />
        <Route path="/create" element={
          <NoteForm createNote={addNote} />
        } />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </Container>
  )
}

export default App