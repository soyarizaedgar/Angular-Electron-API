const mongoose = require("mongoose")

const user_schema = mongoose.Schema({
	username: String,
    email: String,
    password: String,
    createdAt: Date,
    updatedAt: Date
})

module.exports = mongoose.model("User", user_schema)