const express = require("express");
const router = express.Router();
const multer = require("multer");

// 📦 storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 📤 upload images (ADMIN ONLY لو عايز تحميه)
router.post("/", upload.array("images", 5), (req, res) => {
  const imagePaths = req.files.map(file => file.path);

  res.json({
    message: "Images uploaded successfully",
    images: imagePaths
  });
});

module.exports = router;