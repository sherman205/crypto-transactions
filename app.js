const mongoose = require("mongoose");
const Transaction = require("./src/model");
const { parseJSONData, generateDepositData, outputDepositInfo } = require("./src/utilities");

const mongoURL = "mongodb://mongo:27017/transactions";


/**
 * Returns aggregate query for valid deposit data by user.
 */
const aggregateValidDeposits = () => {
    return Transaction.aggregate([
        {
            $match: {
                category: "receive",
                confirmations: {
                    $gte: 6
                }
            }
        },
        {
            $group: {
                _id: "$address",
                count: {
                    $sum: 1
                },
                sum: {
                    $sum: "$amount"
                }
            }
        }]).exec();
}

/**
 * Opens database connection, inserts transactions and processes results.
 * @param {Object[]} transactions
 */
const processTransactions = (transactions) => {
    mongoose.connect(mongoURL, { useNewUrlParser: true });
    const connection = mongoose.connection;

    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.once('open', function () {
        connection.db.dropCollection('transactions')
        .then(() => {
            Transaction.collection.insertMany(transactions)
            .then(() => {
                aggregateValidDeposits()
                .then(deposits => {
                    connection.close()
                    .then(() => {
                        const filteredTransactions = generateDepositData(deposits);
                        outputDepositInfo(filteredTransactions);
                    })
                    .catch(error => {
                        console.log("Error closing database connection: ", error);
                    })
                })
                .catch(error => {
                    console.log("Error aggregating deposits: ", error);
                })
            })
            .catch(error => {
                console.log("Error inserting transactions: ", error);
            })
        })
        .catch(error => {
            console.log("Error dropping collection: ", error);
        })
    });
}

const transactions1 = parseJSONData("./transactions-1.json");
const transactions2 = parseJSONData("./transactions-2.json");
const transactions = transactions1.concat(transactions2);

processTransactions(transactions);
