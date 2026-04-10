const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  input: { type: Array, required: true },
  output: { type: Array, required: true }
});

module.exports = mongoose.model("History", historySchema);