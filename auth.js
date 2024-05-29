const express = require("express");
const { userCollection } = require("./models/userSchema");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.use(express.json());

authRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await userCollection.create({
    email: email,
    role: req.body.role,
    password: hashedPassword,
  });

  res.status(201).json("created successfully");
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userCollection.findOne({ email });

  if (!user) {
    res.status(404).json("no user found");
    return;
  }

  const matchedPassword = bcrypt.compareSync(password, user.password);

  if (!matchedPassword) {
    return res.status(400).json("invalid credentials");
  }

  const { email: userEmail, _id, role } = user;

  const token = jwt.sign(
    {
      email: userEmail,
      userId: _id,
      role: role,
    },
    process.env.SECRET
  );

  res.json(token);
});

module.exports = {
  authRouter,
};
