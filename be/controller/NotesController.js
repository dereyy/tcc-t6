  import Notes from "../model/NotesModel.js";

  // Get All Notes
  export const getNotes = async (req, res) => {
    try {
      const response = await Notes.findAll();
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Gagal mengambil data catatan" });
    }
  };

  // Create Note
  export const createNote = async (req, res) => {
    const { judul, isi } = req.body;  // Ganti title jadi judul
    if (!judul || !isi) {
      return res.status(400).json({ msg: "Judul dan Isi harus diisi" });
    }
    try {
      await Notes.create(req.body);
      res.status(201).json({ msg: "Notes Berhasil Dibuat" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Gagal membuat catatan" });
    }
  };

  // Update Note
  export const updateNote = async (req, res) => {
    const { judul, isi } = req.body;  // Ganti title jadi judul
    if (!judul || !isi) {
      return res.status(400).json({ msg: "Judul dan Isi harus diisi" });
    }
    try {
      const updated = await Notes.update(req.body, {
        where: {
          id: req.params.id
        }
      });
      if (updated[0] === 0) {
        return res.status(404).json({ msg: "Catatan tidak ditemukan" });
      }
      res.status(200).json({ msg: "Notes Berhasil Diubah" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Gagal mengubah catatan" });
    }
  };

  // Delete Note
  export const deleteNote = async (req, res) => {
    try {
      const deleted = await Notes.destroy({
        where: {
          id: req.params.id
        }
      });
      if (deleted === 0) {
        return res.status(404).json({ msg: "Catatan tidak ditemukan" });
      }
      res.status(200).json({ msg: "Notes Berhasil Dihapus" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Gagal menghapus catatan" });
    }
  };
