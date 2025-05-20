import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const Notes = db.define(
  "notes",
  {
    judul: { type: Sequelize.STRING, allowNull: false },
    isi: { type: Sequelize.TEXT, allowNull: false },
    tanggal: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.fn("CURDATE"),
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diubah",
  }
);

export default Notes;
