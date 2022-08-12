const mongoose = require("mongoose")

const event_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
	title: String,
    user_id: mongoose.Schema.Types.ObjectId,
    wallet_id: mongoose.Schema.Types.ObjectId,
    amount: Number,
    date: Date,
    updatedAt: Date,
    allDay: Boolean,
    rrule:Object,
    event_id: mongoose.Schema.Types.ObjectId,
    original: Boolean,
    invesment: Object
})

module.exports = mongoose.model("Event", event_schema)