// Middleware to verify token
import jwt from "jsonwebtoken";
const JWT_SECRET = "mySuperSecretKey_12345";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  //console.log("authHeader: ", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach decoded info (email, userType, etc.)
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

export default verifyToken;