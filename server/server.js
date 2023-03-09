const mongoose = require("mongoose")
const app = require("./app")

// Connect to MongoDB database
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => {
  console.error(err);
});
db.once("open", () => {
  console.log("Connected to DB");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Node server listening on port ${PORT}`);
});
