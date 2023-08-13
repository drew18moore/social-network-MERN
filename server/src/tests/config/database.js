const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const User = require("../../models/User");

let mongoServer;

const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  mongoose.connect(mongoUri);
}

const disconnect = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}

const reset = async () => {
  await User.deleteMany({})
}

module.exports = { connect, disconnect, reset };
