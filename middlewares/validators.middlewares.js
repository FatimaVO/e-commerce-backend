const { body, validationResult } = require("express-validator");

// Utils
const { AppError } = require("../utils/appError.util");

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
    const errorMessages = errors.array().map((err) => err.msg);

    const message = errorMessages.join(". ");

    return next(new AppError(message, 400));
  }

  next();
};

const createUserValidators = [
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("email").isEmail().withMessage("Must provide a valid email"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  checkValidations,
];

const createProductsValidators = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("description")
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("price").isNumeric().withMessage("Price must be an integer"),
  body("quantity").isNumeric().withMessage("Quantity must be an integer"),
  checkValidations,
];

module.exports = { createUserValidators, createProductsValidators };
