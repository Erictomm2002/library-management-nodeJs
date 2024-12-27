const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_ATLAS_URL;
const databaseName = process.env.DATABASE_NAME;
const client = new MongoClient(uri);

let database;

async function connectToDatabase() {
  if (!database) {
    try {
      await client.connect();
      console.log("Database Connected");
      database = client.db(databaseName);
    } catch (error) {
      console.log("Database Connection Error: ", error);
      throw error;
    }
  }
  return database;
}

async function disconnectDB() {
  await client.close();
  console.log("MongoDB connection closed.");
}

module.exports = { connectDB: connectToDatabase, disconnectDB: disconnectDB };