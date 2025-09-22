const mongodb = require("mongodb");
const { get } = require("../routes/admin");
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
    // getting the index of product.To update qty if prod already in cart.
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

  getCart() {
    const db = getDb();
    // Creating array of productIds, to use with $in.
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    return (
      db
        .collection("products")
        // $in in MongoDB finds documents where a field’s value matches
        // any value in a given list.
        .find({ _id: { $in: productIds } })
        .toArray()
        /*
         * $in finds all the docs with the given productIDs,
         * toArray() -> puts all the matched productIDs in an array.
         * products parameter recieves the array created by toArray() method, as it is a promise.
         *
         */
        .then((products) => {
          return products.map((p) => {
            return {
              // Spread the item and the quantity key to the product object 
              ...p,
              // form cart items find the item which matches with the id of the current interating product.
              quantity: this.cart.items.find((i) => {
                return i.productId.toString() === p._id.toString();
              }).quantity,
            };
          });
        })
    );
  }

  // getOrder
  /*
   * To get the orders form db we will,
   * get order collection on which we will use find method
   * and match the current userID with the each document of order collection.
   */
  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongodb.ObjectId(this._id) })
      .toArray()
  }

  // checkProductInCart(){
  //     // get cart
  //     // get products 
  //     // 
  //     const db = getDb
  //     .collection("products")
  //     .getCart()
      
  // }

  

  deleteItemFromCart(productId) {
    // updatedCartItems stores the all the items which not matches the
    // productId.
    const updatedCartItems = this.cart.items.filter((item) => {
      // Keep the item if not matches the productId
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db.collection("users").updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      // update the cart.item with updatedCartItems which holds
      // everything except the productId passed in the parameter of this function.
      { $set: { cart: { items: updatedCartItems } } }
    );
  }

  addOrder() {
    /*
     * We will have to create new collection,
     * coz if we embed then the collection dataset can be too big.
     * 1 - we use getCart to get the products
     * 2 - create a order variable which,
     * contains the products and user:id + name
     * 3 - update the order Collection with the order varible
     * 4 - Remove the products from cart.
     */

    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: this.cart.items,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
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
