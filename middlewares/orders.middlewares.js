// Models
const { Product } = require("../models/product.model");
const { Cart } = require("../models/cart.model");
const { ProductInCart } = require("../models/productInCart.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Cart.findOne({
    where: { id, userId: sessionUser.id, status: "purchased" },
    include: {
      model: ProductInCart,
      where: { status: "purchased" },
      include: [{ model: Product, attributes: ["id", "title", "price"] }],
    },
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  req.order = order;
  next();
});

module.exports = { orderExists };
