const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

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

module.exports = { connect, disconnect };