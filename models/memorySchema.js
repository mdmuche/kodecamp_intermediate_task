const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    memoryTitle: {
      type: String,
      required: true,
    },
    memoryBody: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const memoryCollection = mongoose.model("memory", memorySchema);
module.exports = {
  memoryCollection,
};
