// src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// note: we will hash in auth routes; this pre-save is defensive (only hash if modified)
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
  },
  { timestamps: true }
);

// ensure password not returned by toJSON / toObject
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// defensive hash if password was set directly without hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    // If password already appears hashed (starts with $2b$) skip
    if (typeof this.password === "string" && this.password.startsWith("$2")) {
      return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
