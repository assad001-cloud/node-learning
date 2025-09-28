// src/middleware/validation.js
// Uses express-validator to provide validators for auth and book routes.

const { body, validationResult } = require("express-validator");
const User = require("../models/User");

// helper: check validation result
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => ({ msg: e.msg, param: e.param })) });
  }
  next();
}

/* ----- User registration validation ----- */
const registerValidators = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("username must be 3-20 characters")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage("username may only contain letters, numbers and underscore")
    .custom(async (username) => {
      const exists = await User.findOne({ username });
      if (exists) throw new Error("username already in use");
    }),
  body("email")
    .trim()
    .isEmail().withMessage("email must be valid")
    .custom(async (email) => {
      const exists = await User.findOne({ email });
      if (exists) throw new Error("email already in use");
    }),
  body("password")
    .isLength({ min: 8 }).withMessage("password must be at least 8 characters")
    .matches(/[a-z]/).withMessage("password must contain a lowercase letter")
    .matches(/[A-Z]/).withMessage("password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("password must contain a number"),
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("firstName must be 2-50 characters")
    .matches(/^[A-Za-z]+$/).withMessage("firstName must be alphabetic"),
  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("lastName must be 2-50 characters")
    .matches(/^[A-Za-z]+$/).withMessage("lastName must be alphabetic"),
  handleValidation
];

/* ----- Login validators ----- */
const loginValidators = [
  body("identifier").notEmpty().withMessage("email or username required"),
  body("password").notEmpty().withMessage("password required"),
  handleValidation
];

/* ----- Book validators ----- */
const currentYear = new Date().getFullYear();
const bookValidators = [
  body("title").trim().isLength({ min: 1, max: 200 }).withMessage("title 1-200 chars"),
  body("author").trim().isLength({ min: 1, max: 100 }).withMessage("author 1-100 chars"),
  body("year").isInt({ min: 1000, max: currentYear + 1 }).withMessage(`year must be between 1000 and ${currentYear + 1}`),
  body("genre").optional().isString().withMessage("genre must be a string"),
  body("isbn").optional().isString().isLength({ min: 10, max: 17 }).withMessage("isbn looks invalid"),
  handleValidation
];

module.exports = {
  registerValidators,
  loginValidators,
  bookValidators,
  handleValidation
};
