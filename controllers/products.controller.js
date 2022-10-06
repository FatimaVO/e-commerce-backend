// Models
const { Product } = require("../models/product.model");
const { Category } = require("../models/category.model");
const { User } = require("../models/user.model");
const { ProductImg } = require("../models/productImg.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");
const {
  uploadProductImgs,
  getProductsImgsUrls,
  getProductImgsUrlsbyID,
} = require("../utils/firebase.util");

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: "active" },
    include: [
      { model: Category, attributes: ["name"] },
      { model: User, attributes: ["username", "email"] },
      { model: ProductImg },
    ],
  });

  const productsWithImgs = await getProductsImgsUrls(products);

  res
    .status(200)
    .json({ status: "success", data: { products: productsWithImgs } });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;

  const productWithImgs = await getProductImgsUrlsbyID(product);

  res
    .status(200)
    .json({ status: "success", data: { product: productWithImgs } });
});

const createProduct = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { title, description, quantity, price, categoryId } = req.body;

  const category = await Category.findOne({
    where: { id: categoryId, status: "active" },
  });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const newProduct = await Product.create({
    title,
    description,
    quantity,
    categoryId,
    price,
    userId: sessionUser.id,
  });

  // TODO: Upload image
  await uploadProductImgs(req.files, newProduct.id);

  res.status(201).json({ status: "success", data: { newProduct } });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, quantity, price } = req.body;

  await product.update({ title, description, quantity, price });

  const productWithImgs = await getProductImgsUrlsbyID(product);

  res
    .status(200)
    .json({ status: "success", data: { product: productWithImgs } });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: "removed" });

  res.status(200).json({ status: "success" });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({ where: { status: "active" } });

  res.status(200).json({ status: "success", data: { categories } });
});

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (name.length === 0) {
    return next(new AppError("Name cannot be empty", 400));
  }

  const newCategory = await Category.create({ name });

  res.status(201).json({
    status: "success",
    data: { newCategory },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const category = await Category.findOne({
    where: { id, status: "active" },
  });

  if (!category) {
    return next(new AppError("Category does not exits", 404));
  }

  if (name.length === 0) {
    return next(new AppError("The updated name cannot be empty", 400));
  }

  await category.update({ name });

  res.status(200).json({ status: "success", data: { category } });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory,
  updateCategory,
};
