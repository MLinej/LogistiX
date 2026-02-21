import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];
  const token  = header && header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided. Access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied. Insufficient role." });
  }
  next();
};