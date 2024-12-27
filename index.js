const {connectDB, disconnectDB} = require("./config/db.js");
require('dotenv').config()

async function run() {
  const mongoService = await connectDB();
  try {
    const movies = mongoService.collection('listingsAndReviews');
    const query = {
      name:
        "Ribeira Charming Duplex"
    };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    await disconnectDB();
  }
}

run().catch(console.dir);
