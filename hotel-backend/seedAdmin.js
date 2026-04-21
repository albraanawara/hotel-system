const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/hotelDB");

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    name: "Admin",
    email: "admin@hotel.com",
    password: hashedPassword,
    role: "admin"
  });

  await admin.save();
  console.log("Admin created successfully ");
  mongoose.disconnect();
}

createAdmin();