import { Sequelize } from "sequelize";

const db = new Sequelize("notes", "root", "deanih123.", {
  host: "34.58.156.21",
  dialect: "mysql",
});

export default db;
