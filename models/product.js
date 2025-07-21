const fs = require("fs");
const path = require("path");

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    fs.readFile(p, (err, fileContent) => {
        let products = [];
        
        /* NOTE : 
        * fileContent.length > 0 handles the JSON.parse getting empty value error,
        * if JSON.parse() gets empty value it throws syntax error.
        */
       
       if (!err && fileContent.length > 0) {
           products = JSON.parse(fileContent);
        }
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
            console.log(err);
        });
    });
}

static fetchAll(cb) {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    fs.readFile(p , (err, fileContent) => {
        if(err){
            cb ([])
        }
        cb(JSON.parse(fileContent))
    })
  }
};




