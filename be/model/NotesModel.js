import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const Notes = db.define(
  "notes",
  {
    judul: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isi: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    tanggal: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.fn("CURDATE"),  // Ganti jadi CURDATE biar cuma tanggal
    },
  },
  {
    freezeTableName: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diubah",
  }
);

export default Notes;
(async () => {
  // Buat tabel otomatis saat program dijalankan
  await db.sync();
})();
