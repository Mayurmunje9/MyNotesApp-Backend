const jwt = require("jsonwebtoken");
const JWT_SECRET = "ImAWeb$Token";
const fetchuser = (req, res, next) => {
  // Get user from jwtToken and add id to req obj
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).send({ error: "Error: Missing or invalid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).send("Invalid token");
  }
};

module.exports = fetchuser;
