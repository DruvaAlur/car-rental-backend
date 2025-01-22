const { Router } = require("express");
const router = Router();
const location = require("../db/storeLocations.js");

router.get("/getAllStates", async (req, res) => {
  let states = await location.getAllStates();
  res.send(states);
});
module.exports = router;
