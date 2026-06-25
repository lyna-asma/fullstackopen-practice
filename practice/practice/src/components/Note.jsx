
const Note = ({ note }) => {
    console.log('Note prop received from the array', note)
    return < li > {note.content} </li >
}

export default Note