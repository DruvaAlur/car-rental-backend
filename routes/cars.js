const {
  mongoClient,
  MONGODB_COLLECTION,
  MONGODB_DATABASE,
  User,
  ATLAS_SEARCH_INDEX_API_URL,
} = require("../util.js");
const { Router } = require("express");
// const adminMiddleware = require("../middleware/admin");
const car = require("../db/cars.js");
const router = Router();
const { db } = require("../db/index.js");
const productsCollection = db.collection("cars");

router.get("/getAllCars", async (req, res) => {
  let cars = await car.getAllCars();
  res.send(cars);
});

router.get("/getCategoryWiseCars", async (req, res) => {
  let cars = await car.getAllCars();
  res.send(cars);
});

router.get("/search", async (req, res) => {
  const query = req.query.searchQuery;
  try {
    const agg = [
      {
        $search: {
          index: "name",
          text: {
            query: "Koenigsegg",
            path: {
              wildcard: "*",
            },
          },
        },
      },
      { $limit: 10 },
      { $project: { name: 1 } },
    ];
    // run pipeline
    const results = await productsCollection.aggregate(agg).toArray();
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/autoComplete", async (req, res) => {
  const query = req.query.searchQuery;
  try {
    const agg = [
      {
        $search: {
          index: "name",
          autocomplete: {
            query: "koe",
            path: "name",
            fuzzy: {
              maxEdits: 2,
              prefixLength: 0,
              maxExpansions: 50,
            },
          },
        },
      },
      { $limit: 10 },
      { $project: { name: 1 } },
    ];
    // run pipeline
    const results = await productsCollection.aggregate(agg).toArray();
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
