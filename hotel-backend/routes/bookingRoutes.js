const router = require("express").Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  deleteBooking,
  cancelBooking,
  getAvailableRooms
} = require("../controllers/bookingController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// ================= IMPORTANT ORDER =================

// available rooms (must be first)
router.get("/available", auth, getAvailableRooms);

// user bookings
router.post("/", auth, createBooking);
router.get("/my", auth, getMyBookings);

// admin
router.get("/", auth, admin, getAllBookings);

// actions
router.put("/:id/cancel", auth, cancelBooking);
router.delete("/:id", auth, admin, deleteBooking);

module.exports = router;