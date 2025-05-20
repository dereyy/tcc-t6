import Notes from "../model/NotesModel.js";

export const getNotes = async (req, res) => {
  try {
    const data = await Notes.findAll({
      order: [['createdAt', 'DESC']] // Urutkan dari yang terbaru
    });
    res.json({
      status: "Success",
      data: data
    });
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({
      status: "Error",
      message: "Gagal mengambil data catatan"
    });
  }
};

export const createNote = async (req, res) => {
  try {
    const { judul, isi } = req.body;
    if (!judul || !isi) {
      return res.status(400).json({
        status: "Error",
        message: "Judul dan Isi harus diisi"
      });
    }
    
    const note = await Notes.create({ 
      judul, 
      isi,
      userId: req.userId // Tambahkan userId dari token
    });
    
    res.status(201).json({
      status: "Success",
      message: "Catatan berhasil dibuat",
      data: note
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({
      status: "Error",
      message: "Gagal membuat catatan"
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { judul, isi } = req.body;
    if (!judul || !isi) {
      return res.status(400).json({
        status: "Error",
        message: "Judul dan Isi harus diisi"
      });
    }
    
    const [updated] = await Notes.update(
      { judul, isi },
      { 
        where: { 
          id: req.params.id,
          userId: req.userId // Hanya update note milik user yang login
        } 
      }
    );
    
    if (!updated) {
      return res.status(404).json({
        status: "Error",
        message: "Catatan tidak ditemukan"
      });
    }
    
    res.json({
      status: "Success",
      message: "Catatan berhasil diubah"
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({
      status: "Error",
      message: "Gagal mengubah catatan"
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deleted = await Notes.destroy({ 
      where: { 
        id: req.params.id,
        userId: req.userId // Hanya hapus note milik user yang login
      } 
    });
    
    if (!deleted) {
      return res.status(404).json({
        status: "Error",
        message: "Catatan tidak ditemukan"
      });
    }
    
    res.json({
      status: "Success",
      message: "Catatan berhasil dihapus"
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({
      status: "Error",
      message: "Gagal menghapus catatan"
    });
  }
};
