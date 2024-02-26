const { Car, CategoryImage } = require("./index");
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
function getAllCategory() {
  return CategoryImage.find().then((result) => {
    return result;
  });
}
module.exports = {
  getAllCars,
};
