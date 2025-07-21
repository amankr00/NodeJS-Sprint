// const http = require('http');  Express does this work too
const express = require("express");
const bodyParser = require("body-parser"); // Parses the incoming request bodies in a middleware before your handlers, available under the req.body property
const path = require("path"); // Helps to work with file and directory paths in a cross-platform way
const app = express();
const controllerFolder = require('./controllers/error')
// const handleBars = require("express-handlebars");

const adminRoutes = require("./routes/admin"); // Importing the admin routes
const shopRoutes = require("./routes/shop"); // Importing the shop routes

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
app.set('view engine' , 'ejs')
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

app.listen(3000, () => {
  console.log("Server is listening at 3000!");
});

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
