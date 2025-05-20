import Notes from "../model/NotesModel.js";

export const getNotes = async (req, res) => {
  const data = await Notes.findAll();
  res.json(data);
};

export const createNote = async (req, res) => {
  const { judul, isi } = req.body;
  if (!judul || !isi)
    return res.status(400).json({ msg: "Judul dan Isi harus diisi" });
  await Notes.create({ judul, isi });
  res.status(201).json({ msg: "Notes Berhasil Dibuat" });
};

export const updateNote = async (req, res) => {
  const { judul, isi } = req.body;
  if (!judul || !isi)
    return res.status(400).json({ msg: "Judul dan Isi harus diisi" });
  const [updated] = await Notes.update(
    { judul, isi },
    { where: { id: req.params.id } }
  );
  if (!updated) return res.status(404).json({ msg: "Catatan tidak ditemukan" });
  res.json({ msg: "Notes Berhasil Diubah" });
};

export const deleteNote = async (req, res) => {
  const deleted = await Notes.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ msg: "Catatan tidak ditemukan" });
  res.json({ msg: "Notes Berhasil Dihapus" });
};
