const mongodb = require("mongodb");
const MONGODB_DATABASE = "car-rental";
const MONGODB_COLLECTION = "cars";
const ATLAS_SEARCH_INDEX_API_URL = "cars";

const MONGODB_HOST = process.env.MONGODB_HOST;
const MONGODB_USER = process.env.MONGODB_USERNAME;
const MONGODB_PASS = process.env.MONGODB_PASSWORD;

const mongoClient = new mongodb.MongoClient(
  "mongodb+srv://admin:admin@cluster0.el4pk3b.mongodb.net",
  {
    auth: { username: "admin", password: "admin" },
  }
);

module.exports = {
  MONGODB_DATABASE,
  MONGODB_COLLECTION,
  ATLAS_SEARCH_INDEX_API_URL,
  mongoClient,
};
