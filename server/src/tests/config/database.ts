import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../models/User";

let mongoServer: MongoMemoryServer;

export const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  mongoose.connect(mongoUri);
}

export const disconnect = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}

export const reset = async () => {
  await User.deleteMany({})
}
