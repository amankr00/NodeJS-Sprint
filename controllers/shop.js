// const Product = require("../models/product.MongoDB");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getCart = (req, res, next) => {
  req.user
    // .getCart()
    .populate("cart.items.productId")
    // .execPopulate() -- with mongoose 6.x populate has become a promise.
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     // Check for each product,
  //     // whether it is present or not.
  //     for (product of products) {
  //       cartProductData = cart.products.find((prod) => prod.id === product.id);
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Cart",
  //       products: cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("Here is the result : ", result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  //   // Product.findById(prodId, (product) => {
  //   //   Cart.addProduct(prodId, product.price);
  //   // });
  //   // res.redirect("/cart");
  //   // let fetchedCart;
  //   // let newQuantity = 1;
  //   // req.user
  //   //   .getCart()
  //   //   .then((cart) => {
  //   //     fetchedCart = cart;
  //   //     return cart.getProducts({ where: { id: prodId } });
  //   //   })
  //   //   .then((products) => {
  //   //     let product;
  //   //     if (products.length > 0) {
  //   //       product = products[0];
  //   //     }
  //   //     if (product) {
  //   //       const oldQuantity = product.cartItem.quantity;
  //   //       newQuantity = oldQuantity + 1;
  //   //       return product;
  //   //     }
  //   //     return Product.findByPk(prodId);
  //   //   })
  //   //   .then((product) => {
  //   //     return fetchedCart.addProduct(product, {
  //   //       through: { quantity: newQuantity },
  //   //     });
  //   //   })
  //   //   .then(() => {
  //   //     res.redirect("/cart");
  //   //   })
  //   //   .catch((err) => console.log(err));
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findById(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });

  /*
  req.user is the user with id = 1,
  we access the cart, then get the products 
  */
  req.user
    // .deleteItemFromCart(prodId)
    // .getCart() // fetches the cart which belongs to user ,eg: user id =1 has cart id = 5
    // .then((cart) => {
    //   return cart.getProducts({ where: { id: prodId } });
    // })
    // .then((products) => {
    //   const product = products[0];
    //   return product.cartItem.destroy();
    // })
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  // let fetchCart; // To clear cart when order has been placed
  // get the products list
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      }); // Array of objects, each object having quantity and productId
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user, // mongoose automatically assigns the id form the user object
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      req.user.clearCart();
    })
    .then(() => {
      res.redirect("/order");
    })
    // .then((cart) => {
    //   fetchCart = cart; // Now cart and fetchCart points to the same db location,
    //   //deleting fetchcart.setProducts(NULL) will delete the row in the join table.
    //   return cart.getProducts();
    // })
    // .then((products) => {
    //   /*
    //    * CreateOrder with sequalize magic method,
    //    * then addProducts with seq.. magic method,
    //    * to add the quantity of products we,
    //    * use products.map(product =>{
    //    * product.orderItem = create new variable to store the qty.
    //    * product.orderItem = {quantity: product.cartItem.quantity}
    //    * })
    //    * finally return the product.
    //    */
    //   return req.user
    //     .createOrder()
    //     .then((order) => {
    //       return order.addProducts(
    //         products.map((product) => {
    //           product.orderItem = { quantity: product.cartItem.quantity };
    //           return product;
    //         })
    //       );
    //     })
    //     .catch((err) => console.log(err));
    // })
    // .then((result) => {
    //   return fetchCart.setProducts(null);
    // })
    // .then((result) => {
    //   res.redirect("/order");
    // })
    .catch((err) => console.log(err));
};

exports.getOrder = (req, res, next) => {
  /* Sequalize Part
  .getOrders({ include: ["products"] }) // getOrders will also include products per order
  // this works coz we have relation b/w orders and products.
  */ // Sequalize Part
  console.log("Order is being displayed on the client side!!");
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/order", {
        path: "/order",
        pageTitle: "Your Order",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// Viewing products with products.
exports.getProducts = (req, res, next) => {
  // Used with Raw SQL. *****************
  /*
  Product.fetchAll()
    .then(([rows]) => {
      // fetchAll return array of arrays, thats why -> [row]
      {
        res.render("shop/product-list", {
          prods: rows,
          pageTitle: "Shop",
          path: "/product-list", // To set active = true in templating engine
        });
      }
    })
    .catch((err) => console.log(err));
    */
  // Used with Raw SQL. *****************

  // Product.fetchAll()
  Product.find()
    .then((product) => {
      res.render("shop/product-list", {
        prods: product,
        pageTitle: "Shop",
        path: "/product-list", // To set active = true in templating engine
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// For getting Product Details
exports.getProduct = (req, res, next) => {
  /* The name given with colon (:) in route,
  that can be accessed using params.givenName .
  */
  const prodId = req.params.productId;
  // Product.findByPk(prodId)  // For Sequalize
  // Product.findAll({ where: { id: prodId } })
  /* Mongoose Notes
   *  findById(xyz) -> automaticaly converts the xyz to mongodb.objectID Type.
   */
  Product.findById(prodId)
    .then((products) => {
      // console.log(products);
      res.render("shop/product-details", {
        product: products,
        pageTitle: products.title,
        path: "product-list",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));

  // Product.findById(prodId).then(([product]) => {
  //   res.render("shop/product-details", {
  //     product: product[0], // product parameter recieves array of arrays.
  //     pageTitle: "product-details",
  //     path: "/product-list",
  //   });
  // });
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

// For shop route of nav-bar
exports.getIndex = (req, res, next) => {
  /*
  Product.fetchAll()
    .then(([rows]) => {
      res.render("shop/index", {
        prods: rows, // row is the product
        pageTitle: "Shop",
        path: "/shop",
      });
    })
    .catch((err) => console.log(err));
  */
  Product.find()
    .then((products) => {
      // console.log(products);
      res.render("shop/index", {
        prods: products, // row is the product
        pageTitle: "Shop",
        path: "/shop",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    prods: products,
    pageTitle: "Shop",
    path: "/checkout", // To set active = true in templating engine
    isAuthenticated: req.session.isLoggedIn,
  });
};
