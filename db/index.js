const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const {
  mongoClient,
  MONGODB_COLLECTION,
  MONGODB_DATABASE,
  User,
} = require("../util");
const { request } = require("urllib");
mongoose.connect(`${process.env.MONGO_SERVER_URL}/car-rental`);
const client = new MongoClient(process.env.MONGO_SERVER_URL);
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

const carDetailsSchema = new mongoose.Schema({
  carname: String,
  review: Number,
  title: String,
  titleDescription: String,
  carDescription: String,
  specs: Object,
  price: Number,
  discountedPrice: Number,
  image: Array,
});

const locationSchema = new mongoose.Schema({
  city: String,
  state: String,
  longitude: String,
  latitude: String,
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  firstname: String,
  lastname: String,
});
const Car = mongoose.model("Car", CarsSchema);
const Feature = mongoose.model("Feature", FeaturesSchema);
const CarImage = mongoose.model("CarImage", CarImageSchema);
const CategoryImage = mongoose.model("Category", categorySchema);
const CarDetails = mongoose.model("car-detail", carDetailsSchema);
const LocationSchema = mongoose.model("store-location", locationSchema);
const UserSchema = mongoose.model("User", userSchema);

module.exports = {
  Car,
  Feature,
  CarImage,
  CategoryImage,
  CarDetails,
  LocationSchema,
  db,
  UserSchema,
};
