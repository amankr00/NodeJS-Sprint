const Sequelize = require('sequelize')

const sequelize = require('../utils/database')


/*
* sequalize.define takes 1st parameter as table name
* 2nd paramter defies the structure of model.
*/
const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,  // Data-Type
        autoIncrement: true,  // Increment with each new product
        allowNull: false,     // Always provide value. 
        primaryKey: true  // key for each row in a table
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Product
