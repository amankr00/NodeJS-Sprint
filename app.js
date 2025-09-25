// const http = require('http');  Express does this work too
const express = require("express");
const bodyParser = require("body-parser"); // Parses the incoming request bodies in a middleware before your handlers, available under the req.body property
const path = require("path"); // Helps to work with file and directory paths in a cross-platform way
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();
const controllerFolder = require("./controllers/error");
// const mongoConnect = require("./utils/database").mongoConnect;
// const handleBars = require("express-handlebars");
// const sequelize = require("./utils/database"); // importing sequelize ORM from utils/database.
// const Product = require("./models/product");
// const User = require("./models/user.MongoDB");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");
// const db = require("./utils/database");

// db.execute("SELECT * FROM products")
// .then(result => {
//   console.log(result)
// })

// .catch(err => {
//   console.log(err)
// });

/* app.use() is a method to mount middleware functions at the specified path.
 * Below code will execute for every request made to the server.
 * The first argument is the path, and the second argument is the middleware function.
 * If the path is not specified, it will execute for every request.
 * If the path is specified, it will execute only for requests that match the path.
 */
app.use((req, res, next) => {
  User.findById("68d3c27007a3a76517b1e808")
    .then((user) => {
      // to capture a user to test further works.
      // new User is used to access all the methods of user.
      /*
      * Below line is used with mongodb as returned user was not user -> object.
      req.user = new User(user.name, user.email, user.cart, user._id); 
      */
      // With mongoose findById gives the user object
      req.user = user;
      console.log(user);
      next();
    })
    .catch((err) => console.log(err));
});

// const adminRoutes = require("./routes/admin"); // Importing the admin routes
// const shopRoutes = require("./routes/shop"); // Importing the shop routes

/* Func inside use used by every single request.
app.use('/', (req, res, next) => {
    console.log('This is middleware') 
    next() // Allows the request to continue to the next middleware in line
})  // Next argument is a fucntion . 
*/

app.use(bodyParser.urlencoded({ extended: false })); // Parses URL-encoded bodies (as sent by HTML forms) and makes the data available under req.body
app.use(express.static(path.join(__dirname, "public"))); // Serves static files like css, js, images etc. from public folder

// For express-handlerBars
/*
app.engine(
  "hbs",  // hbs name can be anything
  handleBars({ 
    layoutsDir: "views/layouts/", 
    defaultLayout: "main-layouts" , 
    extname: 'hbs' // Only For Layouts, not for every file with hbs extenstion
})
); 
app.set("view engine", "hbs"); // same name is passed
*/
// app.set('view engine' , 'pug')
app.set("view engine", "ejs");
app.set("views", "views");

/* Why adminRoutes is above shopRoutes?
 * Because the order of middleware matters in Express. The first matching route will be used, so
 * if adminRoutes were below shopRoutes, the /add-product route would never be reached.
 * This is because Express checks the routes in the order they are defined, and if it finds a match,
 * it will not check the subsequent routes.
 */

app.use("/admin", adminRoutes); // Mounts the admin routes on the /admin path
app.use(shopRoutes); // Mounts the shop routes on the root path

app.use(controllerFolder.errorPage);

mongoose
  .connect(
    "mongodb+srv://amanDB:bgcnCS24@e-commerce.sw7dvht.mongodb.net/shop?retryWrites=true&w=majority&appName=E-Commerce"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "max@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => console.log(err));

/* connection with db WITHOUT mongoose 
mongoConnect(() => {
  app.listen(3000);
});
*/

// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); // onDelete will DROP all the products associated with the user being deleted.
// User.hasMany(Product); // Product belongs to many users.
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// This is useful for associating actions (like creating products) with a specific user.
/*
* User will have many orders. (one to many)
* Order will have many users. (one to many)
* Many order will have many products. (many to many) 
NOTE: Many to many requires a join table.
 */
// Order.belongsTo(User)
// User.hasMany(Order)
// Order.belongsToMany(Product ,{through: OrderItem})

// sequelize
//   // sync({ force: true}) // creates tables in the DB by refering the models. Force used to overwrite the db
//   .sync()
//   .then((result) => {
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({ name: "Max", email: "test@test.com" });
//     }
//     return user;
//   })
//   .then((user) => {
//     return user.createCart();
//   })
//   .then((result) => {
//     app.listen(3000);
//   })
//   .catch((err) => console.log(err));

// app.listen(3000, () => {
//   console.log("Server is listening at 3000!");
// });

// const server = http.createServer(app);

// server.listen(3000)

/*  CODE FOR CREATING A SERVER WITHOUT EXPRESS FRAMEWORK
* const mainServer = http.createServer((req,res) => {
*     res.write('<html>')
*     res.write('<head><title>This is created by me</title><head>')
*     res.write('<body><p>Hey! I have started coding!!</p><body>')
*     res.write('<html>')
* })

 mainServer.listen(4000) */
