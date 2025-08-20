const fs = require("fs");
const path = require("path");
const Cart = require("./cart");
const db = require("../utils/database");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

// Reads the data file and holds all its content
getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (!err && fileContent.length > 0) {
      cb(JSON.parse(fileContent));
    } else {
      cb([]);
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?,?,?,?)',
      [this.title, this.price, this.imageUrl, this.description]
    )
  }

  // save() {
  // const p = path.join(
  //   path.dirname(process.mainModule.filename),
  //   "data",
  //   "products.json"
  // );
  // fs.readFile(p, (err, fileContent) => {
  // let products = [];

  /* NOTE :
   * fileContent.length > 0 handles the JSON.parse getting empty value error,
   * if JSON.parse() gets empty value it throws syntax error.
   */

  // if (!err && fileContent.length > 0) {
  //   products = JSON.parse(fileContent);
  // }
  //   this.id = Math.random().toString();
  //   getProductsFromFile((products) => {
  //     products.push(this);
  //     fs.writeFile(p, JSON.stringify(products), (err) => {
  //       console.log(err);
  //     });
  //   });
  // }

  // static fetchAll(cb) {
  //   getProductsFromFile(cb);
  // }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id){
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
  }

  /* FOR - static findById(id, cb)
   * We pass product-ID and a callback function to print the product-Details from controller folder,
   * findById calls the getProductFromFiles to get all the products from products.json file,
   * when we get the product-list , we check check using the find() method,
   * by checking with each product id with the passed id .
   * When we get the product we return the callback function to the controller form where everthing started
   */

  // static findById(id, cb) {
  //   // products parameter recieves all the data from the data.json file
  //   getProductsFromFile((products) => {
  //     // product holds the product with the passed id.
  //     const product = products.find((p) => p.id === id);
  //     cb(product);
  //   });
  // }

  

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProduct = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
};
