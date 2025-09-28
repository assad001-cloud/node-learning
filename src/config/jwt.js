// src/config/jwt.js
// Utility for signing and verifying JWTs and simple in-memory blacklist for logout.
// NOTE: In-memory blacklist is fine for dev/test. For production use a persistent store (Redis).

require("dotenv").config();
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_env";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h"; // e.g. "24h"

// Simple in-memory blacklist for invalidated tokens (logout).
// Structure: { token: expiryTimestamp }
const blacklist = new Map();

// Remove expired tokens from memory periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, exp] of blacklist) {
    if (exp <= now) blacklist.delete(token);
  }
}, 1000 * 60 * 10); // clean every 10 minutes

function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, ...options });
}

function verifyToken(token) {
  if (!token) throw new Error("No token provided");
  if (isBlacklisted(token)) {
    const err = new Error("Token invalidated");
    err.name = "TokenBlacklisted";
    throw err;
  }
  return jwt.verify(token, JWT_SECRET);
}

function blacklistToken(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      // mark with short expiry if cannot decode
      blacklist.set(token, Date.now() + 1000 * 60 * 5);
    } else {
      // exp in seconds -> convert to ms
      blacklist.set(token, decoded.exp * 1000);
    }
    logger.info("Token blacklisted", { short: token.slice(0, 10) });
  } catch (err) {
    // still store with short expiry
    blacklist.set(token, Date.now() + 1000 * 60 * 5);
  }
}

function isBlacklisted(token) {
  if (!token) return false;
  const exp = blacklist.get(token);
  if (!exp) return false;
  if (Date.now() > exp) {
    blacklist.delete(token);
    return false;
  }
  return true;
}

module.exports = {
  signToken,
  verifyToken,
  blacklistToken,
  isBlacklisted,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
