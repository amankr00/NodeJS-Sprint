const Sequelize = require("sequelize");

const sequalize = require("../utils/database-Sequalize");

const Order = sequalize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
