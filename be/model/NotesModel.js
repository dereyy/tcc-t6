import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const Notes = db.define(
  "notes",
  {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
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
      defaultValue: Sequelize.fn("CURDATE"),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diubah",
  }
);

// Tambahkan logging untuk debugging
db.authenticate()
  .then(() => {
    console.log("[Database] Koneksi database berhasil");
  })
  .catch(err => {
    console.error("[Database] Gagal koneksi ke database:", err);
  });

(async () => {
  try {
    await db.sync({ alter: true });
    console.log("[Database] Tabel notes berhasil disinkronkan");
  } catch (error) {
    console.error("[Database] Gagal sinkronisasi tabel:", error);
  }
})();

export default Notes;
