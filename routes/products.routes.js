const express = require("express");

// Controllers
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory,
  updateCategory,
} = require("../controllers/products.controller");

// Middlewares
const { productExists } = require("../middlewares/products.middlewares");
const { categoryExists } = require("../middlewares/categories.middlewares");
const {
  protectSession,
  protectProductsOwners,
} = require("../middlewares/auth.middlewares");
const {
  createProductsValidators,
} = require("../middlewares/validators.middlewares");

const { upload } = require("../utils/multer.util");

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);

productsRouter.get("/categories", getAllCategories);

productsRouter.get("/:id", productExists, getProductById);

// Protecting below endpoints
productsRouter.use(protectSession);

productsRouter.post(
  "/",
  upload.array("productImg", 5),
  createProductsValidators,
  createProduct
);

productsRouter.post("/categories", createCategory);

productsRouter.patch("/categories/:id", categoryExists, updateCategory);

productsRouter.patch(
  "/:id",
  productExists,
  protectProductsOwners,
  updateProduct
);

productsRouter.delete(
  "/:id",
  productExists,
  protectProductsOwners,
  deleteProduct
);

module.exports = { productsRouter };
