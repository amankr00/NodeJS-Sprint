const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    db = getDb()
      .db.collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("User Updated");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addToCart(product) {
    if (!this.cart) {
      this.cart = { items: [] };
    }
    // getting the index of product.
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    // if index is something, it means we have a product.
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    // const updatedCart = { items: [{ ...product, quantity: 1 }] };
    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    db.collection("users").updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      { $set: { cart: updatedCart } } // Overwrites the new cart with old cart.
    );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;

/* SEQUALIZE
const Sequelize = require("sequelize");

const sequelize = require("../utils/database-Sequalize"); // has the connection with DB

const User = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = User;

SEQUALIZE */
