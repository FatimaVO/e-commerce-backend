// Models
const { Cart } = require("../models/cart.model");
const { Product } = require("../models/product.model");
const { ProductInCart } = require("../models/productInCart.model");
const { Order } = require("../models/order.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const addProductToCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId, quantity } = req.body;

  // Validate that requested qty doesnt exceed the available qty
  const product = await Product.findOne({
    where: { id: productId, status: "active" },
  });

  if (!product) {
    return next(new AppError("Product does not exists", 404));
  } else if (quantity > product.quantity) {
    return next(
      new AppError(`This product only has ${product.quantity} items.`, 400)
    );
  }

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
  });

  if (!cart) {
    // Assign cart to user (create cart)
    const newCart = await Cart.create({ userId: sessionUser.id });

    await ProductInCart.create({ cartId: newCart.id, productId, quantity });
  } else {
    // Cart already exists
    const productInCart = await ProductInCart.findOne({
      where: { productId, cartId: cart.id },
    });

    if (!productInCart) {
      // Add product to current cart
      await ProductInCart.create({ cartId: cart.id, productId, quantity });
    } else if (productInCart.status === "active") {
      return next(
        new AppError("This product is already active in your cart", 400)
      );
    } else if (productInCart.status === "removed") {
      await productInCart.update({ status: "active", quantity });
    }
  }

  res.status(200).json({
    status: "success",
  });
});

const updateProductInCart = catchAsync(async (req, res, next) => {
  const { productId, newQty } = req.body;
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: {
      userId: sessionUser.id,
      status: "active",
    },
  });

  if (!cart) {
    return next(new AppError("The user does not have an active cart", 400));
  }

  const product = await Product.findOne({ where: { id: productId } });

  const productInCart = await ProductInCart.findOne({
    where: {
      productId,
      status: "active",
    },
  });

  if (!productInCart) {
    return next(new AppError("Product non found", 404));
  }

  if (newQty == 0) {
    await productInCart.update({ status: "removed" });
  }

  if (product.quantity < newQty) {
    return next(
      new AppError(`This product only has ${product.quantity} items.`, 400)
    );
  } else {
    await productInCart.update({ quantity: newQty });
  }

  res.status(200).json({
    status: "success",
    data: { productInCart },
  });
});

const purchaseCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { status: "active", userId: sessionUser.id },
  });
  if (!cart) {
    return next(new AppError("There are no products in the cart", 404));
  }

  const productsInCart = await ProductInCart.findAll({
    where: { cartId: cart.id, status: "active" },
  });

  const purchase = await Promise.all(
    productsInCart.map(async (productInCart) => {
      const product = await Product.findOne({
        where: { id: productInCart.productId },
      });
      const updatedProduct = await product.update({
        quantity: product.quantity - productInCart.quantity,
      });
      const productsPurchased = await productInCart.update({
        status: "purchased",
      });
      const productPrices = productInCart.quantity * product.price;
      return productPrices;
    })
  );

  let sum = 0;
  for (let i = 0; i < purchase.length; i++) {
    sum += purchase[i];
  }
  const total = sum;
  await cart.update({ status: "purchased" });

  createdOrder = await Order.create({
    userId: sessionUser.id,
    cartId: cart.id,
    totalPrice: total,
  });

  res.status(201).json({
    status: "success",
    data: { createdOrder },
  });
});

const deleteProductInCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const productInCart = await ProductInCart.findOne({
    where: {
      productId,
      status: "active",
    },
  });

  if (!productInCart) {
    return next(new AppError("Product not found in cart", 400));
  }

  await productInCart.update({ quantity: 0, status: "removed" });

  res.status(204).json({ status: "success" });
});

module.exports = {
  addProductToCart,
  updateProductInCart,
  purchaseCart,
  deleteProductInCart,
};
