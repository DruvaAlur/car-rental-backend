const mongoose = require("mongoose");
const { Car, CategoryImage, CarDetails, LocationSchema } = require("./index");

function getAllStates() {
  return LocationSchema.find().then((result) => {
    return result;
  });
}
module.exports = {
  getAllStates,
};
