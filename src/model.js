const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    involvesWatchOnly: Boolean,
    account: String,
    address: String,
    category: String,
    amount: mongoose.Types.Decimal128,
    label: String,
    confirmations: Number,
    blockhash: String,
    blockindex: Number,
    blocktime: Number,
    txid: String,
    vout: Number,
    walletconflicts: Array,
    time: Number,
    timereceived: Number,
    'bip125-replaceable': String
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
