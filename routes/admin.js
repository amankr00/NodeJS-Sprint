const express = require("express");
const path = require("path");
const router = express.Router();
// const rootDir = require("../utils/path");
const productsController = require("../controllers/products.js")



// admin/add-product => GET
router.get("/add-product", productsController.getAddProducts);

// admin/add-product => POST
router.post("/add-product", productsController.postAddProducts);

module.exports = router;
