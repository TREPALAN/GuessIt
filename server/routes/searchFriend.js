const User = require("../models/user");
const { validationResult } = require("express-validator");
const searchFriendRoute = async (req, res) => {
  username = req.query.username;
  const users = await User.find({
    username: { $regex: username, $options: "i" },
  }).select("_id username profilePicture");

  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }

  res.json(users);
};

module.exports = searchFriendRoute;
