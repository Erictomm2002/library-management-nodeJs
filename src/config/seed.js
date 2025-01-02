import { faker } from '@faker-js/faker';
const {connectDB, disconnectDB} = require("./mongoDB-init.js");

const database = await connectDB();

// INIT RAW DATA
const users = Array.from({ length: 10 }).map(() => ({
  userId: faker.string.uuid(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['user', 'admin']),
  password: faker.internet.password(),
}));

const books = Array.from({ length: 10 }).map(() => ({
  bookId: faker.string.uuid(),
  title: faker.book.title(),
  author: faker.book.author(),
  genre: faker.book.genre(),
  publishedYear: faker.date.birthdate({ mode: 'year', min: 1980, max: 2020 }).getFullYear(),
  quantity: faker.number.int({min: 1, max: 200}),
  borrowedCount: faker.number.int({min: 1, max: 200}),
}))

const transactions = Array.from({ length: 5 }).map((_, index) => ({
  userId: users[index].userId,
  bookId: books[index].bookId,
  borrowDate: faker.date.recent({days: 30}),
  dueDate: faker.date.future({years: 1}),
  returnDate: faker.date.future({years: 1}),
  fine: faker.number.int({min: 1, max: 100}),
  status: faker.helpers.arrayElement(['borrowed', 'returned'])
}))


// ISOLATED INIT FUNCTION
async function userInit() {
  try {
    const userCollection = await database.createCollection("user");
    await userCollection.insertMany(users);
    console.log("Users data inserted.");
    return true;
  } catch (error) {
    console.error("Error while creating user collection: ", error.message);
    return false;
  }
}

async function bookInit() {
  try {
    const bookCollection = await database.createCollection("book");
    await bookCollection.insertMany(books);
    console.log("Books data inserted.");
    return true;
  } catch (error) {
    console.error("Error while creating books collection: ", error.message);
    return false;
  }
}

async function transactionInit() {
  try {
    const transactionCollection = await database.createCollection("transaction");
    await transactionCollection.insertMany(transactions);
    console.log("Transaction data inserted.");
    return true;
  } catch (error) {
    console.error("Error while creating transaction collection: ", error.message);
    return false;
  }
}


// SEED FUNCTION DECLARATION
async function seed(){
  try {
    const collections = await database.listCollections().toArray();

    // Remove all old collections
    for (const collection of collections) {
      const collectionName = collection.name;
      await database.collection(collectionName).drop();
      console.log(`Dropped collection: ${collectionName}`);
    }

    // Init new collection and data
    await userInit();
    await bookInit();
    await transactionInit();

  } catch (error) {
    console.error("Error during seeding process: ", error.message);
  } finally {
    await disconnectDB();
    console.log("Disconnected from database.");
  }
}


// RUN SEED
await seed()