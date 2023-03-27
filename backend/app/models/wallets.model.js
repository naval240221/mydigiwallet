'use strict';
const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  date: { type: Date },
}, {
    timestamps: true,
    id: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = doc._id;
            ret.id = ret.id.toString();
            delete ret._id;
        }
    }
});

module.exports = mongoose.model("wallets", walletSchema);