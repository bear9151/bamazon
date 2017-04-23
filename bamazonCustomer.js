var fs = require("fs"),
    mysql = require("mysql"),
    inquirer = require("inquirer");

// var for mySQL connection information
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// initiating the mysql server and database, error catching and print connection ID
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});