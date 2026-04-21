const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: String,
  price: Number,
  type: String,

  images: [String], // 🔥 صور متعددة

  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Room", roomSchema);