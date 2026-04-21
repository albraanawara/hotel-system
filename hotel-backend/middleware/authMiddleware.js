module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const decoded = require("jsonwebtoken").verify(
      token.replace("Bearer ", ""),
      "secret123"
    );

    req.user = decoded;
    next();

  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};