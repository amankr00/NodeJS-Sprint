/* Sequalize Part Of The Code.
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
*/

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  // Array of product documents.
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  // User data
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
});

module.exports = mongoose.model('Order', orderSchema)