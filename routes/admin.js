const express = require('express')
const path = require('path') 
const router = express.Router()
const rootDir = require('../utils/path')

const products = [] // Array to store products

// admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    console.log('Get : /add-product')
    // res.send(
    //     '<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type = "Submit">Add Product</button></form>'
    // )
    // res.sendFile(path.join( rootDir , 'views' , 'add-product.html' ))

    res.render('add-product' , {pageTitle: "Add-Product"})
})

// admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    products.push({title : req.body.title})
    console.log(req.body)
    res.redirect('/')
})

exports.routes = router
exports.products = products

