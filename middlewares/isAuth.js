const jwt = require("jsonwebtoken");
const fs = require("fs");

const isAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    let err = new Error("You can't access this feature without logging in!");
    err.status = 401;
    return next(err);
    /////// return res.status(401).json({ message: 'You can\'t access this feature without logging in!' });
  }
  // Get the token from the header
  const token = authHeader.split(" ")[1];
  // Verify the token
  try {
    // Read the public key
    const cert = process.env.JWT_SECRET;

    // Verify the token
    jwt.verify(token, cert, (err, payload) => {
      if (err) {
        console.error("Invalid signature:", err.message);
        // Handle the error
       
        return next(err);
        ////// return res.status(403).json({ message: "Failed to login" });
      } else {
        req.userId = payload.userId;
        next();
      }
    });
  } catch (error) {
    console.error(error);
    // Handle the error
    next(error);
    /////// return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = isAuth;
