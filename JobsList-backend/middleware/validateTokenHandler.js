const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateTokenHandler = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401);
      return next(new Error("Authorization token is missing"));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        return next(new Error("Unauthorized, token verification failed"));
      }

      // ✅ normalize user object so req.user._id is always available
      req.user = {
        _id: decoded.user._id || decoded.user.id,
        email: decoded.user.email,
        name: decoded.user.name || "", // optional
      };

      next();
    });
  } else {
    res.status(401);
    return next(new Error("Authorization header is missing or in the wrong format"));
  }
});

module.exports = validateTokenHandler;
