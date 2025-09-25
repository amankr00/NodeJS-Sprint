// const Sequelize = require("sequelize");

// const sequelize = require("../utils/database-Sequalize");
const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb; // allows to get connection with database
// const ObjectId = mongodb.ObjectId
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    (this.title = title),
      (this.price = price),
      (this.description = description),
      (this.imageUrl = imageUrl);
    this.id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId  // Who Created the product.
    // this._id = new mongodb.ObjectId(id);
    // // new mongodb.ObjectId(id) --> Creates new ObjectId even id is undefined.
  }
 
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // ..update
      dbOp = db
        .collection("products")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this); // Only takes the object which is to be inserted
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addtoCart(product) {
    const updatedCart = { items: [{ ...products, quantity: 1 }] };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(product._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static fetchAll() {
    const db = getDb(); // To get access to db.
    return db
      .collection("products")
      .find() // Gets the data from db one by one.
      .toArray() // Puts the data into Array.
      .then((products) => {
        console.log(products);
        return products;
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) }) // new mongodb.ObjectId(prodId) converts string to objectId type same as that of _id's type.
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((result) => {
        console.log(result);
        console.log("Deleted");
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;

// /*
//  * sequalize.define takes 1st parameter as table name
//  * 2nd paramter defies the structure of model.
//  */
// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER, // Data-Type
//     autoIncrement: true, // Increment with each new product
//     allowNull: false, // Always provide value.
//     primaryKey: true, // key for each row in a table
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Product;
