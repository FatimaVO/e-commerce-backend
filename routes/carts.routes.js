const express = require("express");

// Controllers
const {
  addProductToCart,
  updateProductInCart,
  deleteProductInCart,
  purchaseCart,
} = require("../controllers/carts.controller");

// Middlewares
const { protectSession } = require("../middlewares/auth.middlewares");

const cartsRouter = express.Router();

// Protecting below endpoints
cartsRouter.use(protectSession);

cartsRouter.post("/add-product", addProductToCart);

cartsRouter.patch("/update-cart", updateProductInCart);

cartsRouter.post("/purchase", purchaseCart);

cartsRouter.delete("/:productId", deleteProductInCart);

module.exports = { cartsRouter };
