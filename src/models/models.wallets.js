const mongoose = require("mongoose")

const wallet_schema = mongoose.Schema({
	name: String,
    user_id: mongoose.Schema.Types.ObjectId,
    type: String,
    createdAt: Date,
    updatedAt: Date,
    initial_amount:Number,
    total_amount:Number
})

module.exports = mongoose.model("Wallet", wallet_schema)
