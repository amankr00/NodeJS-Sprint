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
    editing : false
  });
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

// exports.getEditProduct = (req, res, next) => {
//   console.log("Get : /edit-product");
//   // res.send(
//   //     '<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type = "Submit">Add Product</button></form>'
//   // )
//   // res.sendFile(path.join( rootDir , 'views' , 'add-product.html' ))

//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
  
//   // params - To capture dynamic routes from routes file. 
//   const prodId = req.params.productId
//   Product.findById(prodId , product => {
//     if(!product){
//       return res.redirect('/')
//     }
//     res.render("admin/edit-products", {
//       pageTitle: "Edit Product",
//       path: "/admin/edit-product", // To set active = true in templating engine
//       editing: editMode, // If editing will be used to create difference coz same ejs file is used both for Add-product and edit-product
//       product: product
//     });
//   }) 
//   console.log(editMode)
// };

exports.getEditProduct = (req, res, next) => {
  console.log('Editing!!!')
  // editMode - To check whether adding is done or editing is done!!
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  // params - Captures the dynamic routing , send from routes folder!!
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
      res.render('admin/edit-products', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
  });
  });
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

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.deleteById(prodId)
  res.redirect("admin-products")
}

