const express = require("express");
const router = express.Router();
// const path = require("path");
// const rootDir = require("../utils/path");
// const adminData = require("./admin");

const shopController = require("../controllers/shop.js");

/* What will happen if we use router.use instead of router.get?
 * If we use router.use, it will match all HTTP methods (GET, POST, PUT, DELETE, etc.) for the specified path.
 * This means that the middleware will be executed for any request made to the / path, regardless of the HTTP method.
 * In contrast, router.get will only match GET requests to the / path, which is what we want for serving the shop page.
 * So, using router.get is more appropriate here as we are only interested in handling GET requests
 */

/*
 * path.join() detects the OS an concat the path
 * Linux System -> /users/aman/desktop
 * Windows System -> \users\aman\desktop
 * So path.join() detects automatically the os,
 * that why we have give views and shop.html
 * seperatly , coz its gets concatinated
 * res.sendFile(path.join(__dirname,'../' ,'views' , 'shop.html'))
 */
// console.log('shop.js ',adminData.products)
// res.sendFile(path.join(rootDir, 'views', 'shop.html'))
// router.get("/", shopController.getIndex);
// router.get("/products" , shopController.getProducts);
// : (colon) - means at that position something will come.
/* 
* If another route with /products/xyx is there , 
* then put the more specific route on top .
* coz if the one with colon is interpreted first then 
* at : (colon) position the xyz will get attached and then
* product/xyz will be routed.
*/
router.get("/products/:productId" , shopController.getProduct);
router.get("/" , shopController.getIndex);
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart)
router.post("/cart-delete-item", shopController.postCartDelete)
router.get("/order", shopController.getOrder);
// router.get("/checkout",shopController.getCheckout);
router.post('/create-order', shopController.postOrder )

module.exports = router;
                     