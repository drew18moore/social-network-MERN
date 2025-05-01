import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const mongoUri = process.env.MONGO_URI!;

export const connect = async () => {
  await mongoose.connect(mongoUri);
}

export const disconnect = async () => {
  await mongoose.disconnect();
}

export const reset = async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
}
