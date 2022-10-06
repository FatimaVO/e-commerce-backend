const { DataTypes, db } = require("../utils/database.util");

const ProductImg = db.define("productImg", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  imgUrl: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  productId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  status: {
    allowNull: false,
    defaultValue: "active",
    type: DataTypes.STRING,
  },
});

module.exports = { ProductImg };
