let mysql = require("mysql");
let config = require("./db.config");

let con = mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB,
});

module.exports = con;
