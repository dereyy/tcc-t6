import { useState } from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';

const Note = ({ id, title, text, date, handleDeleteNote, handleEditNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title || "");   // Default string kosong
  const [editText, setEditText] = useState(text || "");       // Default string kosong
  const characterLimit = 200;

  const handleTitleChange = (event) => {
    setEditTitle(event.target.value);
  };

  const handleTextChange = (event) => {
    if (characterLimit - event.target.value.length >= 0) {
      setEditText(event.target.value);
    }
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editText.trim()) {
      handleEditNote(id, editTitle, editText);
      setIsEditing(false);
    }
  };

  const handleTextareaResize = (event) => {
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  return (
    <div className={`note ${isEditing ? 'editing' : ''}`}>
      {isEditing ? (
        <>
          <input
            type='text'
            value={editTitle}
            onChange={handleTitleChange}
            className='note-title'
            style={{ width: '100%' }}
          />
          <textarea
            value={editText}
            onChange={handleTextChange}
            onInput={handleTextareaResize}
            style={{ 
              resize: 'none',
              width: '100%',
              overflow: 'hidden'
            }}
          ></textarea>
          <div className='note-footer'>
            <small>{characterLimit - editText.length} Remaining</small>
            <button className='save' onClick={handleSaveEdit}>
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>{title || "Tanpa Judul"}</h3>          {/* Default kalau undefined */}
          <span>{text || "Tanpa Isi"}</span>         {/* Default kalau undefined */}
          <div className='note-footer'>
          <small>{date ? new Date(date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "Tidak Ada Tanggal"}</small>
            <div>
              <MdEdit
                onClick={() => setIsEditing(true)}
                className='edit-icon'
                size='1.3em'
              />
              <MdDeleteForever
                onClick={() => handleDeleteNote(id)}
                className='delete-icon'
                size='1.3em'
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Note;
