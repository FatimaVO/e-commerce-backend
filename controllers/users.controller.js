const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model");
const { Product } = require("../models/product.model");
const { Cart } = require("../models/cart.model");
const { ProductInCart } = require("../models/productInCart.model");
const { Order } = require("../models/order.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
  });

  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({ status: "success", data: { newUser } });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { username, email } = req.body;

  await user.update({ username, email });

  res.status(200).json({ status: "success", data: { user } });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: "deleted" });

  res.status(204).json({
    status: "success",
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: "active" },
  });

  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid credentials", 400));
  }

  // Generate JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  user.password = undefined;

  res.status(200).json({ status: "success", data: { token, user } });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const products = await Product.findAll({ where: { userId: sessionUser.id } });

  res.status(200).json({ status: "success", data: { products } });
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const orders = await Cart.findAll({
    where: { userId: sessionUser.id, status: "purchased" },
    include: {
      model: ProductInCart,
      where: { status: "purchased" },
      include: [{ model: Product, attributes: ["id", "title", "price"] }],
    },
  });
  res.status(200).json({ status: "success", data: { orders } });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { order } = req;
  res.status(200).json({ status: "success", data: { order } });
});

module.exports = {
  createUser,
  login,
  getAllProducts,
  updateUser,
  deleteUser,
  getAllOrders,
  getOrderById,
};
