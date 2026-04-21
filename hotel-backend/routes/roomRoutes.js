const router = require("express").Router();
const {
  getRooms,
  createRoom,
  deleteRoom,
  updateRoom,
  getRoomById   
} = require("../controllers/roomController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public
router.get("/", getRooms);

// Protected
router.post("/", auth, admin, createRoom);
router.put("/:id", auth, admin, updateRoom);
router.delete("/:id", auth, admin, deleteRoom);
router.put("/:id", auth, admin, updateRoom);
router.get("/:id", auth, admin, getRoomById);

module.exports = router;
