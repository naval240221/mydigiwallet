module.exports = app => {
    const wallets = require("../controllers/wallet.controller.js");

    var router = require("express").Router();

    // Create a new Wallet
    router.post("/setup", wallets.create);

    // Retrieve a Wallet
    router.get("/wallet/:id", wallets.findOne);

    // Create a transaction
    router.post("/transact/:walletId", wallets.createTransaction);

    // Retrieve a single Tutorial with id
    router.get("/transactions", wallets.fetchTransactions);

    // Get all transactions count
    router.get("/transactions/count", wallets.getAllTransactionCount);

    router.get("/download/:walletId", wallets.downloadTransactionToCsv);

    app.use('/', router);
};