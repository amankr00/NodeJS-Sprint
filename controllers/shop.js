const Product = require("../models/product");
const Cart = require('../models/cart')

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Cart",
  });
};

exports.postCart = (req, res, next) => {
  prodId = req.body.productId
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price)
  })
  res.redirect('/cart')
}

exports.getOrder = (req, res, next) => {
  res.render("shop/order", {
    path: "/order",
    pageTitle: "Order",
  });
};


exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/product-list", // To set active = true in templating engine
    });
  });
};

exports.getProduct = (req, res, next) => {
  /* The name given with colon (:) in route,
  that can be accessed using params.givenName .
  */
  const prodId = req.params.productId
  Product.findById(prodId , product => {
    res.render('shop/product-details', 
      {
        product: product,
        pageTitle : 'product-details',
        path : '/product-list'
      }
    )
  })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/shop", // To set active = true in templating engine
    });
  });
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
      prods: products,
      pageTitle: "Shop",
      path: "/checkout", // To set active = true in templating engine
    });
};

