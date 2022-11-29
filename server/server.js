const express = require("express")
const mongoose = require("mongoose")
const app = express()
const port = 3000
const cors = require("cors")
app.use(cors({ origin: "http://127.0.0.1:5173", }))
const authRouter = require("./routes/auth")
const postsRouter = require("./routes/posts")

require('dotenv').config()

// Connect to MongoDB database
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (err) => {
  console.log(err);
})
db.once('open', () => {
  console.log("Connected to DB");
})

// Routing
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)

app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);
})