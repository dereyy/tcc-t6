  import { useState } from "react";

  const AddNote = ({ handleAddNote }) => {
    const [noteTitle, setNoteTitle] = useState(""); // State untuk judul
    const [noteText, setNoteText] = useState(""); // State untuk isi
    const characterLimit = 200;

    const handleTitleChange = (event) => {
      setNoteTitle(event.target.value);
    };

    const handleTextChange = (event) => {
      if (characterLimit - event.target.value.length >= 0) {
        setNoteText(event.target.value);
      }
    };

    const handleSaveClick = () => {
      if (noteTitle.trim().length > 0 && noteText.trim().length > 0) {
        handleAddNote({
          judul: noteTitle, // Kirim sebagai judul, bukan title
          isi: noteText, // Kirim sebagai isi, bukan text
        });
        setNoteTitle(""); // Bersihkan input judul
        setNoteText(""); // Bersihkan input isi
      }
    };

    return (
      <div className="note new">
        <input
          type="text"
          placeholder="Type your tittle"
          value={noteTitle}
          onChange={handleTitleChange}
          className="note-title"
        />
        <textarea
          rows="8"
          cols="10"
          placeholder="Type to add a note..."
          value={noteText}
          onChange={handleTextChange}
        ></textarea>
        <div className="note-footer">
          <small>{characterLimit - noteText.length} Remaining</small>
          <button className="save" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </div>
    );
  };

  export default AddNote;
