const { before, afterEach, after } = require("node:test");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.JWT_SECRET = "test-secret";

let mongoServer;

// Each test file gets its own in-memory MongoDB, wiped between tests.
before(async () => {
  // mongod can be slow to boot on Windows (antivirus scans the binary).
  mongoServer = await MongoMemoryServer.create({
    instance: { launchTimeout: 60000 },
  });
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
