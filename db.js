const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Nidhin@123',
  database: 'userManagementDB'
});

module.exports = pool.promise();
