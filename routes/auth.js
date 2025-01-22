const { Router } = require("express");
const auth = require("../db/auth");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const router = Router();
router.post("/signUp", async (req, res) => {
  let user = await auth.getUserByEmail(req.body.email);
  if (user) {
    res.status(500).json({ error: "User Already Exists, Please Login" });
    return;
  }
  req.body.password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");
  const userInserted = await auth.insertUser(req.body);
  if (!userInserted) {
    res.status(500).json({ error: "Sign In Failed, Please try again" });
    return;
  }
  const token = jwt.sign(
    {
      id: userInserted.id,
      email: userInserted.email,
    },
    JWT_SECRET
  );
  res.cookie("token", token);
  res.status(200).json({ error: "User Created Sucessfully", token });
  return;
});

router.post("/login", async (req, res) => {
  let user = await auth.getUserByEmail(req.body.email);
  if (!user) {
    res.send("User Not Found, Please Signup to continue");
    return;
  }
  if (
    crypto.createHash("sha256").update(req.body.password).digest("hex") !=
    user.password
  ) {
    res.send("Wrong Password");
    return;
  }
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET
  );
  res.cookie("token", token);
  res.status(200).json({ error: "User Loggedin Sucessfully", token });
  return;
});

router.get("/checkStatus", async (req, res) => {
  const token = req.cookies.token;
  if (!req.cookies.token) {
    res.send("Please SignIn");
    return;
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  res.send(decoded);
});

router.post("/authLogin", async (req, res) => {
  const { idToken } = req.body;
  console.log(idToken);
  console.log(process.env.Google_Client_Id);
  const client = new OAuth2Client(process.env.Google_Client_Id);
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.Google_Client_Id,
    });

    const payload = ticket.getPayload();

    let user = await auth.getUserByEmail(payload.email);
    console.log(payload);

    if (!user) {
      user = auth.insertUser({
        email: payload.email,
        firstname: payload.given_name,
        lastname: payload.family_name,
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET
    );

    res.cookie("token", token);
    res.status(200).json({ error: "User Loggedin Sucessfully", token });
  } catch (error) {
    res.status(400).json({ message: "Invalid token", error });
  }
});

module.exports = router;
