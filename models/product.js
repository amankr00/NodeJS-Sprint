const fs = require("fs");
const path = require("path");

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
  constructor(title, imageUrl , description , price) {
    this.title = title;
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
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
    this.id = Math.random().toString()
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  /* FOR - static findById(id, cb)
  * We pass product-ID and a callback function to print the product-Details from controller folder,
  * findById calls the getProductFromFiles to get all the products from products.json file,
  * when we get the product-list , we check check using the find() method,
  * by checking with each product id with the passed id .
  * When we get the product we return the callback function to the controller form where everthing started
  */ 

  static findById(id, cb){
    // products parameter recieves all the data from the data.json file
    getProductsFromFile(products => {
      // product holds the product with the passed id.
      const product = products.find(p => p.id === id)
      cb(product)
    })
  }
};
