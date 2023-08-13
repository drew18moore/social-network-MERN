import app from "./app";
import { connect, connection } from "mongoose";

// Connect to MongoDB database
connect(process.env.DATABASE_URL as string);
connection.on("error", (err) => { 
  console.error(err);
});
connection.once("open", () => {
  console.log("Connected to DB");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Node server listening on port ${PORT}`);
});
