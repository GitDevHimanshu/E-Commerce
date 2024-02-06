
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.mysqlUser,
    password: process.env.mysqlPass,
    database: 'ecomm',
})

module.exports = connection





