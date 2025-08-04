const Product = require("../models/product");
const Cart = require("../models/cart");

/*
 */
exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      // Check for each product,
      // whether it is present or not.
      for (product of products) {
        cartProductData = cart.products.find((prod) => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrder = (req, res, next) => {
  res.render("shop/order", {
    path: "/order",
    pageTitle: "Order",
  });
};

// Viewing products with products.
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(([rows]) => {   // fetchAll return array of arrays, thats why -> [row] 
    {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "Shop",
        path: "/product-list", // To set active = true in templating engine
      });
    }
  })
  .catch(err => console.log(err))
};

// For getting Product Details
exports.getProduct = (req, res, next) => {
  /* The name given with colon (:) in route,
  that can be accessed using params.givenName .
  */
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(([product]) => {
    res.render("shop/product-details", {
      product: product[0],  // product parameter recieves array of arrays.
      pageTitle: "product-details",
      path: "/product-list",
    });
  })
};

// exports.getIndex = (req, res, next) => {
//   Product.fetchAll((products) => {
//     res.render("shop/index", {
//       prods: products,
//       pageTitle: "Shop",
//       path: "/shop", // To set active = true in templating engine
//     });
//   });
// };

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render("shop/index", {
        prods: rows, // row is the product
        pageTitle: "Shop",
        path: "/shop",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    prods: products,
    pageTitle: "Shop",
    path: "/checkout", // To set active = true in templating engine
  });
};
