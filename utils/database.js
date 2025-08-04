const mysql = require('mysql2')

/*
* createConnection needs to be excecuted everytime a query runs
* createPool needs to be excecuted only once even though more query is to be excecuted. 
*/
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'bgcnCS24'
})

module.exports = pool.promise()