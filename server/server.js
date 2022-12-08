const express = require("express")
const mongoose = require("mongoose")
const app = express()
const port = 3000
const cors = require("cors")

let whitelist = ["http://localhost:5173", "http://192.168.1.19:5173"]
let corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  }
}
app.use(cors(corsOptions))
const authRouter = require("./routes/auth")
const postsRouter = require("./routes/posts")
const usersRouter = require("./routes/users")

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
app.use('/api/users', usersRouter)

app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);
})