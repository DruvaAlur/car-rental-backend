require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const carsRouter = require("./routes/cars");
const authRouter = require("./routes/auth");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/cars", carsRouter);
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
