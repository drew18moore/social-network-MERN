const express = require("express")
const app = express()
const port = 3000
require('dotenv').config()

// Connect to MongoDB database
const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (err) => {
  console.log(err);
})
db.once('open', () => {
  console.log("Connected to DB");
})


app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);
})