// src/middleware/auth.js
// Middlewares: requireAuth, optionalAuth, requireAdmin, requireOwnership

const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

// Extract token helpers
function getTokenFromRequest(req) {
  // Prefer Authorization header: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  // Fallback to cookie named 'token'
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

// Required authentication middleware
async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ error: true, message: "Authentication required" });

    const payload = verifyToken(token);
    // Attach user minimal info (id + role) to req.user
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ error: true, message: "User not found" });

    req.user = user;
    req.token = token; // current token
    next();
  } catch (err) {
    if (err.name === "TokenBlacklisted") return res.status(401).json({ error: true, message: "Token invalidated" });
    return res.status(401).json({ error: true, message: "Invalid or expired token" });
  }
}

// Optional auth - attaches req.user if token valid, otherwise continues
async function optionalAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return next();
    const payload = verifyToken(token);
    const user = await User.findById(payload.id).select("-password");
    if (user) {
      req.user = user;
      req.token = token;
    }
    return next();
  } catch (err) {
    // ignore token errors for optional auth
    return next();
  }
}

// Require admin role
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: true, message: "Authentication required" });
  if (req.user.role !== "admin") return res.status(403).json({ error: true, message: "Admin access required" });
  next();
}

// Require ownership: resourceUserId can be grabbed from params or body
function requireOwnership(getResourceOwnerId) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: true, message: "Authentication required" });
    try {
      const ownerId = getResourceOwnerId(req);
      if (!ownerId) return res.status(400).json({ error: true, message: "Owner ID not provided" });
      if (String(req.user._id) !== String(ownerId) && req.user.role !== "admin") {
        return res.status(403).json({ error: true, message: "Forbidden - not owner" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin,
  requireOwnership,
};
