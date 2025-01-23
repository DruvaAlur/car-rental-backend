const {
  Car,
  CategoryImage,
  CarDetails,
  LocationSchema,
  CitySchema,
} = require("./index");
const mongoose = require("mongoose");

function getAllCars() {
  return Car.find()
    .populate("image")
    .populate("feature")
    .populate("category")
    .then((result) => {
      return result;
    });
}
function getCarById(id) {
  return Car.findById(id)
    .populate("image")
    .populate("feature")
    .populate("category")
    .then((result) => {
      return result;
    });
}
function getCarDetails(name) {
  return CarDetails.findOne({ carname: name }).then((result) => {
    return result;
  });
}
function getAllCategory() {
  return CategoryImage.find().then((result) => {
    return result;
  });
}

function getCityAndState(city, state) {
  let cityRegex = new RegExp(city, "i");
  let stateRegex = new RegExp(state, "i");
  return LocationSchema.find({
    city: { $regex: cityRegex },
    state: { $regex: stateRegex },
  }).then((result) => {
    return result;
  });
}

function getAllCities() {
  return CitySchema.find().then((result) => {
    return result;
  });
}

module.exports = {
  getAllCars,
  getCarById,
  getCarDetails,
  getCityAndState,
  getAllCities,
};
