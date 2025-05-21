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
    timestamps: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diubah",
  }
);

// Add foreign key constraint
Notes.associate = (models) => {
  Notes.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

export default Notes;
