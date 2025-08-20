const Product = require("../models/product");

exports.getAddProducts = (req, res, next) => {
  console.log("Adding!!");
  // res.send(
  //     '<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type = "Submit">Add Product</button></form>'
  // )
  // res.sendFile(path.join( rootDir , 'views' , 'add-product.html' ))

  res.render("admin/edit-products", {
    pageTitle: "Add-Product",
    path: "/admin/add-product", // To set active = true in templating engine
    editing: false,
  });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  /*
   * req.user is the user object that we set in app.js middleware.
   * createProduct is a method that Sequelize adds to the User model when we define a one-to many relationship
   * between User and Product. It allows us to create a new Product that is associated with the user.
   * This method takes an object with the product details as an argument and returns a promise.
   */
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/admin-products");
    })
    .catch((err) => {
      console.log(err);
    });

  /* const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err)); */ // used with raw SQL
};

/*
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

  // params - To capture dynamic routes from routes file.
  const prodId = req.params.productId
  Product.findById(prodId , product => {
    if(!product){
      return res.redirect('/')
    }
    res.render("admin/edit-products", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product", // To set active = true in templating engine
      editing: editMode, // If editing will be used to create difference coz same ejs file is used both for Add-product and edit-product
      product: product
    });
  })
  console.log(editMode)
};
*/

exports.getEditProduct = (req, res, next) => {
  console.log("Editing!!!");
  // editMode - To check whether adding is done or editing is done!!
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  // params - Captures the dynamic routing , send from routes folder!!
  const prodId = req.params.productId;
  // Product.findByPk(prodId)
  req.user
    .getProducts({ where: { id: prodId } })
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-products", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/admin/admin-products");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/admin-products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  req.user.getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "admin-products",
      });
    })
    .catch((err) => console.log(err));

  /*
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Shop",
      path: "admin-products", // To set active = true in templating engine
      });
      }); */
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => product.destroy())
    .then((result) => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/admin-products");
    })
    .catch((err) => console.log(err));
  res.redirect("/admin/admin-products");
};
