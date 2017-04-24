// Declaring initial variables... FileSystem, 3 npm packages, and two global variables.
var fs = require("fs"),
    mysql = require("mysql"),
    inquirer = require("inquirer"),
    chalk = require("chalk"),
    amountWanted = 0,
    newDBamount = 0;

// Variable for mySQL connection information
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// Initiating the mysql server and database, error catching and print connection ID
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID# " + connection.threadId);
    console.log(chalk.bold.underline.yellow("Welcome to Bamazon."));
    console.log(chalk.grey.dim("Where you can find everything from B to Z. (Good Luck with the A's.)"));
    frontDoor();
});

// First function called when starting the app, as well as redirecting after a purchase. If a user chooses "NO",
// then the app will quit.

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
    });
}

// Function to show a list of all products. (Not using inquirer here)
function showProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(chalk.bold(res[i].item_id) + "  " + res[i].product_name + " " + chalk.green("$" + res[i].price.toFixed(2)));
        }
        newPurchase();
    });
}

// Two nested inquirer prompts. One asks if a purchase would like to be made, the second produces a list of products
// and asks the quantity (which reassigns the global 'amountWanted' variable)

function newPurchase() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt({
            name: "purchase",
            type: "confirm",
            message: "Would you like to make a purchase?"
        }).then(function (answer) {
            if (answer.purchase === true) {
                inquirer.prompt([{
                    name: "itemList",
                    type: "rawlist",
                    message: "Which item would you like to buy?",
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name);
                        }
                        return choiceArray;
                    }
                },{
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to buy?"
                }]).then(function (answer) {
                    amountWanted = answer.quantity;
                    console.log("Great! Checking the stock...");
                    stockCheck(answer.itemList);
                })
            } else {
                frontDoor();
            }
        });
    });
}

// Function for checking the inventory from the database. We pass in an argument of 'item' to be used throughout the
// app. This was captured during a previous inquirer rawlist in the newPurchase function.
function stockCheck(item) {
    connection.query("SELECT * FROM products WHERE ?", {
        product_name: item
    }, function (err, res) {
        if (err) throw err;
        if (res[0].stock_quantity >= amountWanted) {
            console.log("Good news! We have that many in stock...");
            newDBamount = res[0].stock_quantity - amountWanted;
            completePurchase(item);
        } else {
            console.log("Uhoh! Looks like there isn't enough in inventory. Care to try a lower amount, or buy" +
                " something else?");
            newPurchase();
        }
    });
}

// This function completes the transaction by updating the database and using the amount variables to calculate a
// total for the customer to see
function completePurchase(item) {
    connection.query("UPDATE products SET ? WHERE ?", [
        {
            stock_quantity: newDBamount
        },
        {
            product_name: item
        }
    ],
    function (err, res) {
        if (err) throw err;
    });
    connection.query("SELECT * FROM products WHERE ?", {product_name: item}, function(err, res) {
        if (err) throw err;
        var cost = (amountWanted * res[0].price).toFixed(2);
        console.log("Transaction Complete! Your credit card has been charged a total of " + chalk.green("$" + cost));
        frontDoor();
    })
}