import Notes from "../model/NotesModel.js";

// Get All Notes
export const getNotes = async (req, res) => {
  try {
    console.log("[getNotes] Mulai mengambil data catatan");
    console.log("[getNotes] Headers:", req.headers);
    console.log("[getNotes] User ID dari token:", req.userId);

    // Coba ambil semua catatan dulu tanpa filter
    const allNotes = await Notes.findAll();
    console.log("[getNotes] Semua catatan:", allNotes);

    // Jika berhasil, baru filter berdasarkan userId
    const userId = req.userId;
    if (!userId) {
      console.log("[getNotes] UserId tidak ditemukan");
      return res.status(401).json({ msg: "User ID tidak ditemukan" });
    }

    const userNotes = await Notes.findAll({
      where: {
        userId: userId
      }
    });

    console.log("[getNotes] Catatan user:", userNotes);
    res.status(200).json(userNotes);
  } catch (error) {
    console.error("[getNotes] Error detail:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({ 
      msg: "Gagal mengambil data catatan",
      error: error.message,
      details: error.stack
    });
  }
};

// Create Note
export const createNote = async (req, res) => {
  try {
    const { judul, isi } = req.body;
    const userId = req.userId;

    console.log("[createNote] Data yang diterima:", { judul, isi, userId });

    if (!judul || !isi) {
      return res.status(400).json({ msg: "Judul dan Isi harus diisi" });
    }

    if (!userId) {
      return res.status(401).json({ msg: "User ID tidak ditemukan" });
    }

    const newNote = await Notes.create({
      judul,
      isi,
      userId,
      tanggal: new Date()
    });

    console.log("[createNote] Catatan berhasil dibuat:", newNote);
    res.status(201).json({ msg: "Notes Berhasil Dibuat", data: newNote });
  } catch (error) {
    console.error("[createNote] Error:", error);
    res.status(500).json({ 
      msg: "Gagal membuat catatan",
      error: error.message 
    });
  }
};

// Update Note
export const updateNote = async (req, res) => {
  try {
    const { judul, isi } = req.body;
    const userId = req.userId;
    const noteId = req.params.id;

    console.log("[updateNote] Data yang diterima:", { judul, isi, userId, noteId });

    if (!judul || !isi) {
      return res.status(400).json({ msg: "Judul dan Isi harus diisi" });
    }

    if (!userId) {
      return res.status(401).json({ msg: "User ID tidak ditemukan" });
    }

    const updated = await Notes.update(
      { judul, isi },
      {
        where: {
          id: noteId,
          userId: userId
        }
      }
    );

    console.log("[updateNote] Hasil update:", updated);

    if (updated[0] === 0) {
      return res.status(404).json({ msg: "Catatan tidak ditemukan" });
    }
    res.status(200).json({ msg: "Notes Berhasil Diubah" });
  } catch (error) {
    console.error("[updateNote] Error:", error);
    res.status(500).json({ 
      msg: "Gagal mengubah catatan",
      error: error.message 
    });
  }
};

// Delete Note
export const deleteNote = async (req, res) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;

    console.log("[deleteNote] Data yang diterima:", { userId, noteId });

    if (!userId) {
      return res.status(401).json({ msg: "User ID tidak ditemukan" });
    }

    const deleted = await Notes.destroy({
      where: {
        id: noteId,
        userId: userId
      }
    });

    console.log("[deleteNote] Hasil delete:", deleted);

    if (deleted === 0) {
      return res.status(404).json({ msg: "Catatan tidak ditemukan" });
    }
    res.status(200).json({ msg: "Notes Berhasil Dihapus" });
  } catch (error) {
    console.error("[deleteNote] Error:", error);
    res.status(500).json({ 
      msg: "Gagal menghapus catatan",
      error: error.message 
    });
  }
};
