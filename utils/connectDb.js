const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async (cb) => {
  try {
    let db = await mongoose.connect(process.env.URL);
    if (db.STATES.connected === 1) {
      console.log("connection to db was successful");
      cb();
    } else {
      console.log("connection to db was not successful");
    }
  } catch (err) {
    console.error(err);
    throw new Error("connection to db failed", err.message);
  }
};

module.exports = {
  connectDb,
};
