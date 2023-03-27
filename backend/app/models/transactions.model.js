'use strict';
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'wallets', required: true },
  amount: { type: Number },
  balance: { type: Number },
  type: { type: String, required: true },
  date: { type: Date },
}, {
    timestamps: true,
    id: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = doc._id;
            ret.id = ret.id.toString();
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret._id;
        }
    }
});

module.exports = mongoose.model("transactions", transactionSchema);