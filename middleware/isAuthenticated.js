import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Support token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.id = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default isAuthenticated;
