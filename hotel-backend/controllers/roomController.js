const Room = require("../models/Room");

const Booking = require("../models/Booking");
// Get All Rooms
exports.getRooms = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const now = new Date();

    // 1. جلب كل الغرف
    let rooms = await Room.find({
      name: { $regex: search, $options: "i" }
    })
    .skip((page - 1) * limit)
    .limit(Number(limit));

    // 2. منطق التحديث التلقائي:
    // لكل غرفة، هنشوف هل فيه حجز "نشط" وتاريخ نهايته لسه مجاش؟
    const updatedRooms = await Promise.all(rooms.map(async (room) => {
      const activeBooking = await Booking.findOne({
        room: room._id,
        status: "active",
        toDate: { $gte: now } // تاريخ النهاية أكبر من أو يساوي دلوقتي
      });

      // لو مفيش حجز نشط حالياً، المفروض الغرفة تكون متاحة
      const shouldBeAvailable = !activeBooking;

      // تحديث الداتابيز فقط لو الحالة الحالية مختلفة عن المفروض تكون عليه
      if (room.available !== shouldBeAvailable) {
        room.available = shouldBeAvailable;
        await room.save();
      }
      return room;
    }));

    res.json(updatedRooms);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add Room (Admin only)


exports.createRoom = async (req, res) => {
  try {
    console.log("🔥 CREATE ROOM HIT");
    console.log("BODY:", req.body);

    const room = await Room.create(req.body);

    console.log("✅ ROOM SAVED:", room);

    res.json(room);
  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json(err);
  }
};
// Update Room
exports.getRoomById = async (req, res) => {
  const room = await Room.findById(req.params.id);
  res.json(room);
};

exports.updateRoom = async (req, res) => {
  const updated = await Room.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};
// Delete Room
exports.deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    console.log("Deleting room:", roomId);

    // 1. تأكد إن الروم موجود
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    // 2. امسح الحجوزات المرتبطة
    await Booking.deleteMany({ room: roomId });

    // 3. امسح الروم
    await Room.findByIdAndDelete(roomId);

    res.json({ msg: "Room deleted successfully" });

  } catch (err) {
    console.log("DELETE ROOM ERROR:", err); // 👈 مهم جدًا
    res.status(500).json({ msg: "Error deleting room", error: err.message });
  }
};