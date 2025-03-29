import Note from './Note';
import AddNote from './AddNote';

const NotesList = ({ notes, handleAddNote, handleDeleteNote, handleEditNote }) => {
  return (
    <div className='notes-list'>
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          title={note.judul}       // Ganti title jadi judul
          text={note.isi}          // Ganti text jadi isi
          date={note.tanggal}      // Ganti date jadi tanggal
          handleDeleteNote={handleDeleteNote}
          handleEditNote={handleEditNote}  
        />
      ))}
      <AddNote handleAddNote={handleAddNote} />
    </div>
  );
};

export default NotesList;
