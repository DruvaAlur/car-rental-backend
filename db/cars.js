const { Car, CategoryImage, CarDetails } = require("./index");
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
module.exports = {
  getAllCars,
  getCarById,
  getCarDetails,
};
