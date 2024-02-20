const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!(await bcrypt.compare(password, user.hashedPassword))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  //   Generate JWT
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ message: "Login successful", token });
};

module.exports = login;
