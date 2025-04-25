/** @format */

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const connectDB = async () => {
  const db = await open({
    filename: path.join(__dirname, "../projectDb.db"),
    driver: sqlite3.Database,
  });
  console.log("Database connected successfully!");
  return db;
};

module.exports = connectDB;
