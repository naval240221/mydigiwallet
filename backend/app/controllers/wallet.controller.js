
var ObjectId = require('mongoose').Types.ObjectId;

const Wallets = require('../models/wallets.model');
const Transactions = require('../models/transactions.model');

const downloadResource = require('../util');

function isValidNumber(x, type) {
    // check if the passed value is a number
    x = Number(x);
    if (typeof x == 'number' && !isNaN(x)) {
        // check if it is integer
        if (Number.isInteger(x)) {
            return {
                "valid": true,
                "value": parseInt(x)
            };
        } else {
            let splitData = x.toString().split('.')
            if (splitData >= 2 && splitData[0].length > 4) {
                return {
                    "valid": false,
                    "error": "Number should can have upto 4 digit after decimal"
                };
            } else {
                return {
                    "valid": true,
                    "value": parseFloat(parseFloat(x).toFixed(4))
                };
            }
        }
    } else {
        return {
            "valid": true,
            "error": type + " is not a valid number"
        };
    }
}

module.exports = {
    create: async (req, res) => {
        try {
            const { name, balance } = req.body;
            if (!name) {
                res.status(400).json({
                    error: "Please provide wallet name to setup an wallet"
                });
                return
            }
            let createBody = {
                name,
                date: new Date()
            };
            var validBalance = isValidNumber(balance, 'Balance');
            if (balance && !validBalance.valid) {
                res.status(400).json({
                    error: "Please provide a correct input for balance"
                });
                return
            }
            if (validBalance.value) {
                createBody = Object.assign(createBody, {'balance': validBalance.value});
            }
            
            const walletData = await Wallets.create(createBody);
            if (!walletData) {
                res.status(404).json({
                    'error': "Can not setup a wallet right now"
                })
                return
            }
            if (balance) {
                await Transactions.create({
                    amount: validBalance.value,
                    balance: validBalance.value,
                    walletId: walletData._id.toString(),
                    description: "Setup",
                    type: "CREDIT",
                    date: new Date()
                })
            }
            return res.status(200).json(walletData);
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    },

    findOne: async (req, res) => {
        try {
            const { params } = req;
            if (!params.id) {
                res.status(400).json({
                    error: "Please provide wallet id to fetch wallet details"
                });
                return
            }
            const walletData = await Wallets.findOne({
                _id: new ObjectId(params.id)
            })
            if (!walletData) {
                res.status(404).json({
                    'error': "No wallet exists with these details"
                })
                return
            }
            return res.status(200).json(walletData)
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    },

    createTransaction: async (req, res) => {
        try {
            const { params, body } = req;
            if (!params.walletId) {
                res.status(400).json({
                    error: "Please provide wallet id to fetch wallet details"
                });
                return
            }
            var validBalance = isValidNumber(body.amount, 'Amount');
            if (!body.amount || !validBalance.valid) {
                return res.status(400).json({
                    error: "Please provide a valid amount"
                })
            }
            if (!body.type || ['CREDIT', 'DEBIT'].indexOf(body.type) < 0) {
                return res.status(400).json({
                    error: "Transaction can be a type of Debit/Credit"
                })
            }
            const walletDoc = await Wallets.findOne({
                _id: new ObjectId(params.walletId)
            }, {name: 1, balance: 1})
            if (!walletDoc) {
                return res.status(404).json({
                    error: "Wallet with this wallet id does not exists"
                })
            }
            if (body.type === "DEBIT" && validBalance.value > 0) {
                validBalance.value = -1 * validBalance.value
            }
            // If transaction is a debit transaction then do validate
            // If a wallet has sufficeint funds
            if (body.type === "DEBIT" && (walletDoc.balance + validBalance.value) < 0) {
                return res.status(400).json({
                    error: "You have insufficent funds in your wallet"
                })
            }
            if (body.type === "CREDIT" && !body.description) {
                body.description = "Recharge";
            }
            const transactionData = {
                amount: validBalance.value,
                walletId: params.walletId,
                description: body.description || '',
                balance: walletDoc.balance + validBalance.value,
                type: body.type,
                date: new Date()
            }
            const transactionDocCreated = await Transactions.create(transactionData);
            if (!transactionDocCreated) {
                res.status(404).json({
                    'error': "No wallet exists with these details"
                })
                return
            }
            await Wallets.updateOne({
                _id: new ObjectId(params.walletId)
            }, {
                'balance': walletDoc.balance + validBalance.value
            });
            return res.status(200).json({
                'balance': transactionDocCreated.balance,
                'transactionId': transactionDocCreated._id.toString()
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    },

    fetchTransactions: async (req, res) => {
        try {
            const { query } = req;
            if (!query.walletId) {
                res.status(400).json({
                    error: "Please provide wallet id to fetch transaction for wallet"
                });
                return
            }
            let limit = parseInt(query.limit) || 10;
            let skip = parseInt(query.skip) || 0;
            let sort = query.sort || {'date': 'desc'};
            if (typeof sort === 'string') {
                sort = JSON.parse(sort);
            }
            const walletDoc = await Wallets.findOne({
                _id: new ObjectId(query.walletId)
            }, {name: 1, balance: 1})
            if (!walletDoc) {
                return res.status(404).json({
                    error: "Wallet with this wallet id does not exists"
                })
            }
            const transactionQuery = {
                walletId: new ObjectId(query.walletId),
                deleted: {'$ne': true}
            }
            const transactions = await Transactions.find(transactionQuery).sort(sort).skip(skip).limit(limit)
            if (!transactions || !transactions.length) {
                console.log("No More Transactions")
            }
            return res.status(200).json(transactions)
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    },
    
    getAllTransactionCount: async (req, res) => {
        try {
            const { query } = req;
            if (!query.walletId) {
                res.status(400).json({
                    message: "Please provide wallet id to fetch transaction for wallet"
                });
                return
            }
            const walletDoc = await Wallets.findOne({
                _id: new ObjectId(query.walletId)
            }, {name: 1, balance: 1})
            if (!walletDoc) {
                return res.status(404).json({
                    error: "Wallet with this wallet id does not exists"
                })
            }
            const transactionQuery = {
                walletId: new ObjectId(query.walletId),
                deleted: {'$ne': true}
            }
            const transactionCount = await Transactions.count(transactionQuery)
            return res.status(200).json({
                "count": transactionCount
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    },

    downloadTransactionToCsv: async (req, res) => {
        try {
            const { params } = req;
            if (!params.walletId) {
                res.status(400).json({
                    message: "Please provide wallet id to fetch transaction for wallet"
                });
                return
            }
            const walletDoc = await Wallets.findOne({
                _id: new ObjectId(params.walletId)
            }, {name: 1, balance: 1})
            if (!walletDoc) {
                return res.status(404).json({
                    error: "Wallet with this wallet id does not exists"
                })
            }
            const transactionQuery = {
                walletId: new ObjectId(params.walletId),
                deleted: {'$ne': true}
            }
            const fields = [
                {
                    label: 'Transaction Id',
                    value: '_id'
                },
                {
                    label: 'Transaction Date',
                    value: 'date'
                },
                {
                    label: 'Transaction Amount',
                    value: 'amount'
                },
                {
                    label: 'Balance Amount',
                    value: 'balance'
                },
                {
                    label: 'Transaction Type',
                    value: 'type'
                },
                {
                    label: 'Description',
                    value: 'description'
                }
            ]
            const transactionsData = await Transactions.find(transactionQuery);
            downloadResource(res, 'transactions.csv', fields, transactionsData)
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    }
}