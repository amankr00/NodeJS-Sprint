const express = require("express");
const path = require("path");
const router = express.Router();
// const rootDir = require("../utils/path");
const adminController = require("../controllers/admin.js");

// admin/add-product => GET
router.get("/add-product", adminController.getAddProducts);

// admin/add-product => POST
router.post("/add-product", adminController.postAddProducts);

router.get("/admin-products", adminController.getProducts);

router.get("/edit-product/:productId" , adminController.getEditProduct)

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product' , adminController.postDeleteProduct)
module.exports = router;
