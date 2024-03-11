require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const carsRouter = require("./routes/cars");
const cors = require("cors");
// const userRouter = require("./routes/user");
app.use(cors());
// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/cars", carsRouter);
// app.use("/user", userRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
