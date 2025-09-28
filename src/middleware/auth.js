// src/middleware/auth.js
// requireAuth, optionalAuth, requireOwnership, requireAdmin

const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

/**
 * Extract token from Authorization header "Bearer <token>" or cookie "token"
 */
function getTokenFromReq(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) return authHeader.split(" ")[1];
  if (req.cookies && req.cookies.token) return req.cookies.token;
  return null;
}

async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ error: "Authentication required" });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "Invalid token user" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

async function optionalAuth(req, res, next) {
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      req.user = null;
      return next();
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
}

/**
 * requireOwnership: checks resource.userId or resource.user field
 * usage: requireOwnership(Model, 'userId') or requireOwnership(Model)
 */
function requireOwnership(Model, field = "userId") {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Authentication required" });
      const resource = await Model.findById(req.params.id);
      if (!resource) return res.status(404).json({ error: "Resource not found" });

      const ownerId = (resource[field] || resource.user || resource.userId)?.toString();
      if (!ownerId) return res.status(403).json({ error: "Ownership info missing" });

      if (ownerId !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }
      next();
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  };
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Authentication required" });
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin privileges required" });
  return next();
}

module.exports = { requireAuth, optionalAuth, requireOwnership, requireAdmin };
