const Booking = require("../models/Booking");
const Room = require("../models/Room");

// ================= CREATE BOOKING =================
exports.createBooking = async (req, res) => {
  try {
    const { roomId, fromDate, toDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ msg: "Invalid dates" });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      return res.status(400).json({ msg: "Invalid date range" });
    }

    // check overlap
    const existingBooking = await Booking.findOne({
      room: roomId,
      status: "active",
      $or: [
        {
          fromDate: { $lt: end },
          toDate: { $gt: start }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({
        msg: "Room already booked in this period"
      });
    }

    const totalPrice = days * room.price;

    const booking = await Booking.create({
      user: req.user.id,
      room: roomId,
      fromDate: start,
      toDate: end,
      totalPrice,
      status: "active"
    });

    res.json(booking);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= GET MY BOOKINGS =================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("room");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= GET ALL BOOKINGS =================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("room");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= CANCEL BOOKING =================
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ msg: "Booking cancelled" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= DELETE BOOKING =================
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ msg: "Booking deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= AVAILABLE ROOMS =================
exports.getAvailableRooms = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({ msg: "Dates required" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const bookings = await Booking.find({
      status: "active",
      $or: [
        { fromDate: { $lt: end }, toDate: { $gt: start } }
      ]
    });

    const bookedIds = bookings.map(b => b.room);

    const rooms = await Room.find({
      _id: { $nin: bookedIds }
    });

    res.json(rooms);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};