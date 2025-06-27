// src/config/database.ts
import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import fs from "fs";
import Home from "../models/home";
import About from "../models/about";
import Resource from "../models/resource";
import Admin from "../models/admin";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "../..", "database.sqlite"),
  logging: (msg) => msg.includes("CREATE") || msg.includes("ERROR") ? console.log(msg) : null, // Reduce log noise
});

const TextEntry = sequelize.define("TextEntry", {
  content: { type: DataTypes.TEXT, allowNull: false },
});

// Initialize models once
let modelsInitialized = false;
if (!modelsInitialized) {
  Home.initModel(sequelize);
  About.initModel(sequelize);
  Resource.initModel(sequelize);
  Admin.initModel(sequelize);
  modelsInitialized = true;
}

const syncDatabase = async () => {
  try {
    const dbPath = path.resolve(__dirname, "../..", "database.sqlite");
    const existingDb = fs.existsSync(dbPath);
    if (!existingDb) {
      await sequelize.sync({ force: true }); // Force initial creation
      console.log("Database created at", dbPath);
    } else {
      await sequelize.sync({ alter: false }); // No alterations
      console.log("Database verified at", dbPath);
    }
    return true;
  } catch (error) {
    console.error("Failed to sync database:", error);
    throw error;
  }
};

const models = { Home, About, Resource, TextEntry, Admin };

export { sequelize, syncDatabase, Home, About, Resource, TextEntry, Admin, models };