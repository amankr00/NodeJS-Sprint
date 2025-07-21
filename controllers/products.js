const Product = require("../models/product");

exports.getAddProducts = (req, res, next) => {
  console.log("Get : /add-product");
  // res.send(
  //     '<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type = "Submit">Add Product</button></form>'
  // )
  // res.sendFile(path.join( rootDir , 'views' , 'add-product.html' ))

  res.render("add-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
    formCSS: true,
    productCSS: true,
    activeProduct: true,
  });
};

exports.postAddProducts = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/shop",
      title: "shop",
      productCSS: true,
      activeShop: true,
    });
  });
};
