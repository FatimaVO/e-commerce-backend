const { DataTypes, db } = require("../utils/database.util");

const Order = db.define("order", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  cartId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  totalPrice: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  status: {
    allowNull: false,
    defaultValue: "active",
    type: DataTypes.STRING,
  },
});

module.exports = { Order };