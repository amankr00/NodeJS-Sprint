// const mysql = require('mysql2')

// /*
// * createConnection needs to be excecuted everytime a query runs
// * createPool needs to be excecuted only once even though more query is to be excecuted.
// */
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'bgcnCS24'
// })

// module.exports = pool.promise()


// ******* CONNECTION SETUP BEGINNING ***
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "bgcnCS24", {
  dialect: "mysql", // what db we are using
  host: "localhost", // were the database serve is running.
});

module.exports = sequelize;
// ******* CONNECTION SETUP END *********