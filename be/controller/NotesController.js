import Notes from "../model/NotesModel.js";
import User from "../model/UserModel.js";

export const getNotes = async (req, res) => {
  try {
    console.log("[getNotes] Fetching notes for userId:", req.userId);
    
    const data = await Notes.findAll({
      where: {
        userId: req.userId
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log("[getNotes] Found notes:", data);
    
    res.json({
      status: "Success",
      data: data || []
    });
  } catch (error) {
    console.error("[getNotes] Error:", error);
    res.status(500).json({
      status: "Error",
      message: "Gagal mengambil data catatan",
      error: error.message
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
    
    console.log("[createNote] Creating note for userId:", req.userId);
    
    const note = await Notes.create({ 
      judul, 
      isi,
      userId: req.userId
    });
    
    console.log("[createNote] Created note:", note);
    
    res.status(201).json({
      status: "Success",
      message: "Catatan berhasil dibuat",
      data: note
    });
  } catch (error) {
    console.error("[createNote] Error:", error);
    res.status(500).json({
      status: "Error",
      message: "Gagal membuat catatan",
      error: error.message
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
    
    console.log("[updateNote] Updating note:", req.params.id, "for userId:", req.userId);
    
    const [updated] = await Notes.update(
      { judul, isi },
      { 
        where: { 
          id: req.params.id,
          userId: req.userId
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
    console.error("[updateNote] Error:", error);
    res.status(500).json({
      status: "Error",
      message: "Gagal mengubah catatan",
      error: error.message
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    console.log("[deleteNote] Deleting note:", req.params.id, "for userId:", req.userId);
    
    const deleted = await Notes.destroy({ 
      where: { 
        id: req.params.id,
        userId: req.userId
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
    console.error("[deleteNote] Error:", error);
    res.status(500).json({
      status: "Error",
      message: "Gagal menghapus catatan",
      error: error.message
    });
  }
};
