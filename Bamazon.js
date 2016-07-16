var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root", //Your username
    password: "root", //Your password
    database: "BamazonDB"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
})
                     
var start = function() {
    inquirer.prompt({
        name: "buyornot",
        type: "rawlist",
         message: "Would you like to [BUY] an item or [NOT]?",
         choices: ["BUY", "NOT"]
    }).then(function(answer) {
        if (answer.buyornot.toUpperCase() == "BUY") {
            purchaseGo();
        } else {
            flake();
         }
    })
 }

var purchaseGo = function() {
    connection.query('SELECT * FROM products', function(err, res) {
        console.log(res);
        inquirer.prompt({
            name: "choice",
            type: "rawlist",
            choices: function(value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].ProductName);
                }
                return choiceArray;
            },
            message: "What item would you like to purchase?"
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].ProductName== answer.choice) {
                    var chosenItem = res[i];
                    inquirer.prompt({
                        name: "buy",
                        type: "input",
                        message: "How many would you like to buy?"
                    }).then(function(answer) {
                        console.log("do math here");
                        console.log("chosenItem.StockQuantity = "+ chosenItem.StockQuantity);
                        console.log("parseInt(answer.buy) = " + parseInt(answer.buy));
                       if (chosenItem.StockQuantity > parseInt(answer.buy)) {
                            var newStockQty = chosenItem.StockQuantity -parseInt(answer.buy);
                            console.log(newStockQty);
                            console.log(chosenItem.id);
                            connection.query("UPDATE Products SET StockQuantity="+newStockQty+" WHERE id = "+chosenItem.id);
                            start();
                            // console.log("you smell");
                        } else {
                            console.log("none in stock, you'll have to wait for the next shipment");
                            start();
                        }
                    })
                }
            }
        })
    })
}

var flake = function() {
    console.log("Please come back when you're ready to shop")
};
