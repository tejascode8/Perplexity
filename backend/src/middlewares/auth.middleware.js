import "dotenv/config";
import jwt from "jsonwebtoken";

export function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    // Invalid token - treat as no user
    req.user = null;
  }
  next();
}
