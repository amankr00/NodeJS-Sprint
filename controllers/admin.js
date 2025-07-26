const Product = require("../models/product");

exports.getAddProducts = (req, res, next) => {
  console.log("Get : /add-product");
  // res.send(
  //     '<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type = "Submit">Add Product</button></form>'
  // )
  // res.sendFile(path.join( rootDir , 'views' , 'add-product.html' ))

  res.render("admin/edit-products", {
    pageTitle: "Add-Product",
    path: "/admin/add-product", // To set active = true in templating engine
    formCSS: true,
    productCSS: true,
    activeProduct: true,
  });
};

exports.getEditProduct = (req, res, next) => {
  console.log("Get : /edit-product");
  // res.send(
  //     '<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type = "Submit">Add Product</button></form>'
  // )
  // res.sendFile(path.join( rootDir , 'views' , 'add-product.html' ))

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  // req.params.nameGivenInRouting
  const prodId = req.params.productId
  Product.findById(prodId, product => {
    
  })
  res.render("admin/edit-products", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product", // To set active = true in templating engine
    editing: editMode,
  });

  console.log(editMode)
};


exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Shop",
      path: "admin-products", // To set active = true in templating engine
    });
  });
};
