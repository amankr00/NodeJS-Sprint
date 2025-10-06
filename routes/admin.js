const express = require("express");
const path = require("path");
const router = express.Router();
// const rootDir = require("../utils/path");
const adminController = require("../controllers/admin.js");
const isAuth = require("../middleware/is-auth.js");

// // admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProducts);

// admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProducts);

router.get("/admin-products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
