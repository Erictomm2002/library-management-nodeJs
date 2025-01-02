const express = require('express');
const { connectDB } = require('./src/config/mongoDB-init');

const app = express();

(async () => {
  await connectDB();
  console.log("hii");
})()


module.exports = app;