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
const { db, CitySchema } = require("../db/index.js");
const productsCollection = db.collection("cars");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

router.get("/getAllCars", async (req, res) => {
  let cars = await car.getAllCars();
  res.send(cars);
});

router.get("/getCarById", async (req, res) => {
  const query = req.query.searchQuery;
  let carVar = await car.getCarById(query);
  let carDetails = await car.getCarDetails(carVar.name);
  res.send(carDetails);
});

router.get("/getCategoryWiseCars", async (req, res) => {
  let cars = await car.getAllCars();
  res.send(cars);
});

router.get("/search", async (req, res) => {
  const query = req.query.searchQuery;
  console.log(query);

  try {
    const agg = [
      {
        $search: {
          index: "name",
          text: {
            query: query,
            path: {
              wildcard: "*",
            },
          },
        },
      },
      { $limit: 10 },
      {
        $lookup: {
          from: "categories", // The name of the referenced collection for the 'category' field
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" }, // Convert the categoryInfo array to a single document

      {
        $lookup: {
          from: "carimages", // The name of the referenced collection for the 'image' field
          localField: "image",
          foreignField: "_id",
          as: "imageInfo",
        },
      },
      { $unwind: "$imageInfo" }, // Convert the imageInfo array to a single document

      {
        $lookup: {
          from: "features", // The name of the referenced collection for the 'feature' field
          localField: "feature",
          foreignField: "_id",
          as: "featureInfo",
        },
      },
      { $unwind: "$featureInfo" },
      {
        $project: {
          name: 1,
          category: "$categoryInfo",
          image: "$imageInfo",
          feature: "$featureInfo",
          price: 1,
        },
      },
    ];
    // run pipeline
    const results = await productsCollection.aggregate(agg).toArray();
    console.log(results);

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/autoComplete",
  (req, res, next) => {
    if (req.query.searchQuery.trim() == "") {
      res.json([]);
      return;
    } else {
      next();
    }
  },
  async (req, res) => {
    const query = req.query.searchQuery;
    try {
      const agg = [
        {
          $search: {
            index: "name",
            autocomplete: {
              query: query,
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
        { $project: { _id: 0, name: 1 } },
      ];
      // run pipeline
      const results = await productsCollection.aggregate(agg).toArray();
      console.log(results);

      res.json(results);
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/checkout", async (req, resp) => {
  const carId = req.body.carid;
  let carVar = await car.getCarById(carId);
  let carDetails = await car.getCarDetails(carVar.name);
  const session = await stripe.checkout.sessions.create({
    success_url: process.env.REDIRECTION_Success_URL,
    cancel_url: process.env.REDIRECTION_Failure_URL,
    line_items: [
      {
        price_data: {
          unit_amount: carDetails.price,
          currency: "inr",
          product_data: {
            name: carVar.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
  });
  resp.json({ redirectionURL: session.url });
});

router.post("/getStoreLocation", async (req, resp) => {
  const city = req.body.city;
  const state = req.body.state;
  let response = await car.getCityAndState(city, state);
  resp.json(response);
});

router.get("/getCityList", async (req, resp) => {
  let response = await car.getAllCities();
  resp.json(response);
});
module.exports = router;
