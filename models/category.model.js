const { DataTypes, db } = require("../utils/database.util");

const Category = db.define("category", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  status: {
    allowNull: false,
    defaultValue: "active",
    type: DataTypes.STRING,
  },
});

module.exports = { Category };
