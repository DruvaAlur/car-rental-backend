const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const {
  mongoClient,
  MONGODB_COLLECTION,
  MONGODB_DATABASE,
  User,
} = require("../util");
const { request } = require("urllib");
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.el4pk3b.mongodb.net/car-rental"
);
const client = new MongoClient(
  "mongodb+srv://admin:admin@cluster0.el4pk3b.mongodb.net"
);
const db = client.db("car-rental");
const productsCollection = db.collection("car-rental");
const CarsSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  image: { type: mongoose.Schema.Types.ObjectId, ref: "CarImage" },
  feature: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" },
  price: Number,
});

const FeaturesSchema = new mongoose.Schema({
  PetrolCapacity: Number,
  type: String,
  peopleCapacity: Number,
});

const CarImageSchema = new mongoose.Schema({
  data: Buffer,
});

const categorySchema = new mongoose.Schema({
  category: String,
});
const Car = mongoose.model("Car", CarsSchema);
const Feature = mongoose.model("Feature", FeaturesSchema);
const CarImage = mongoose.model("CarImage", CarImageSchema);
const CategoryImage = mongoose.model("Category", categorySchema);

module.exports = {
  Car,
  Feature,
  CarImage,
  CategoryImage,
  db,
};
