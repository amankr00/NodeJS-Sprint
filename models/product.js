const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/*
 * Mongo is schemaless, but mongoose provides us
 * the utility to give schema for the data.
 * As we often have structure of the data on which we work
 * it doesn't mean that mongo requires schema.
 * Its just a utility provided by mongoose.
 */

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// we give the schema a name, which is here a product.
// product name will be used by the schema.
// mongoose name the collection as the lowercase, plural form : Product -> products

module.exports = mongoose.model("Product", productSchema);
