const { DataTypes, db } = require("../utils/database.util");

const Product = db.define("product", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  description:{
    allowNull: false,
    type: DataTypes.STRING,
  },
  quantity: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  price: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  categoryId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  status: {
    allowNull: false,
    defaultValue: "active",
    type: DataTypes.STRING,
  },
});

module.exports = { Product };
