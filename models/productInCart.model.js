const { db, DataTypes } = require("../utils/database.util");

const ProductInCart = db.define("productInCart", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = { ProductInCart };
