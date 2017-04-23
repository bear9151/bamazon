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
    console.log(chalk.dim("Where you can find everything from B to Z. (Good Luck with the A's.)"));
    frontDoor();
});

function frontDoor() {
    inquirer.prompt({
        name: "frontDoor",
        type: "confirm",
        message: "Would you like to see what's for sale?"
    }).then(function(answer) {
        if (answer.frontDoor === true) {
            showProducts();
        } else {
            console.log("Ok, Goodbye!");
            connection.end();
            process.exit();
        }
    })
}

function showProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(chalk.bold(res[i].item_id) + "  " + res[i].product_name + " " + chalk.bgGreen(res[i].price.toFixed(2)));
        };
    });
    inquirer.prompt({
        name: "purchase",
        type: "confirm",
        message: "Would you like to make a purchase?"
    }).then(function(answer) {
        if (answer.purchase === true) {
            console.log("time to purchse");
        } else {
            frontDoor();
        }
    });
}

