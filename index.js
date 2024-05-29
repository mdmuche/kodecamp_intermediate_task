const express = require("express");
require("dotenv").config();
const { connectDb } = require("./utils/connectDb");
const port = process.env.PORT || 4000;
const { memoryCollection } = require("./models/memorySchema");
const jwt = require("jsonwebtoken");
const { authRouter } = require("./auth");

const app = express();
app.use(authRouter);

app.use(express.json());

const useLogin = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json("no authorization header");
    return;
  }

  const value = authorization.split(" ");

  const tokenType = value[0];
  const token = value[1];

  if (tokenType == "Bearer") {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.decoded = decoded;
    next();
    return;
  }

  res.status(401).json("not authorized");
};

app.get("/", useLogin, async (req, res) => {
  const { userId } = req.decoded;
  const memories = await memoryCollection.find({ user: userId });
  // if (!userId) {
  //   res.status(400).json("you are not allowed to view memories");
  //   return;
  // }

  res.json(memories);
});

app.get("/:id", useLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const memory = await memoryCollection.findById(id);
    res.json(memory);
  } catch (err) {
    console.error(err);
    res.status(500).json("internal server error");
  }
});

app.post("/", useLogin, async (req, res) => {
  try {
    const { memoryTitle, memoryBody } = req.body;
    const { userId } = req.decoded;
    const newMemory = await memoryCollection.create({
      memoryTitle: memoryTitle,
      memoryBody: memoryBody,
      _id: userId,
    });

    res.status(201).json({
      isRequestSuccessful: true,
      newMemory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("internal server error");
  }
});

connectDb(() => {
  app.listen(port, (req, res) => {
    console.log(`listening for requests at port ${port}`);
  });
});
