const refresh = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: decoded.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const newRefreshToken = jwt.sign(
      { username: decoded.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ token, refreshToken: newRefreshToken });
  });
};

module.exports = refresh;
