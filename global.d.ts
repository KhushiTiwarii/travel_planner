import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export {}; // This makes it a module, ensuring TypeScript loads it
