const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'nodejs_Shop'
});

exports.db = pool.promise();