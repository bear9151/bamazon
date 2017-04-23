var fs = require("fs"),
    mysql = require("mysql"),
    inquirer = require("inquirer"),
    chalk = require("chalk");

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
    console.log("Connected as ID# " + connection.threadId);
    console.log(chalk.bold.bgYellow("Welcome to Bamazon."));
    console.log("Where you can find everything from B to Z. (Good Luck with the A's.)");
    showProducts();
});

function showProducts() {
    inquirer.prompt({
        name: "showProducts",
        type: "confirm",
        message: "Would you like to see what's for sale?"
    }).then(function(answer) {
        if (answer.showProducts === true) {
            console.log("products table");
        } else {
            console.log("Ok, Goodbye!");
            process.exit();
        }
    })
}