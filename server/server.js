require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const port = 3000
const cors = require("cors")
const authRouter = require("./routes/auth")
const { router: postsRouter } = require("./routes/posts")
const usersRouter = require("./routes/users")
const commentsRouter = require("./routes/comments")

let corsOptions = {
  origin: "*"
}
app.use(cors(corsOptions))

// Connect to MongoDB database
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (err) => {
  console.error(err);
})
db.once('open', () => {
  console.log("Connected to DB");
})

// Routing
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)
app.use('/api/comments', commentsRouter)

app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);
})