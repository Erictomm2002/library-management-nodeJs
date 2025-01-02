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

      handleAppExit();
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

function handleAppExit(){
  if (!process.env.MONG0_EXIT_HANDLER_ATTACHED){
    process.on('SIGINT', async () => {
      console.log("Application is stopping (SIGINT)...");
      await disconnectDB();
      process.exit(0);
    })

    process.on('SIGTERM', async () => {
      console.log("Application is stopping (SIGTERM)...");
      await disconnectDB();
      process.exit(0);
    })

    process.on("uncaughtException", async (err) => {
      console.error("Uncaught exception occurred:", err);
      await disconnectDB();
      process.exit(1); // Thoát với mã lỗi
    });

    process.env.MONG0_EXIT_HANDLER_ATTACHED = "true";
  }
}

module.exports = { connectDB: connectToDatabase, disconnectDB: disconnectDB };