const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },

  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },

  totalPrice: { type: Number, required: true },

  status: {
    type: String,
    enum: ["active", "cancelled", "completed"],
    default: "active"
  }
});

module.exports = mongoose.model("Booking", bookingSchema);