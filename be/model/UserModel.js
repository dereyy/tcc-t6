import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const User = db.define(
  "user",
  {
    name: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING, unique: true },
    gender: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    refresh_token: { type: Sequelize.TEXT },
  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

// Add relationship with Notes
User.associate = (models) => {
  User.hasMany(models.Notes, {
    foreignKey: 'userId',
    as: 'notes'
  });
};

export default User;
