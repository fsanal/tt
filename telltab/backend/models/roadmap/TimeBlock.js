const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types

var timeblockSchema = new Schema({
    created: {type: Date, required: true},
    title: {type: String, required: true},
    beginDate: Date,
    endDate: Date
});

var TimeBlock = mongoose.model("TimeBlock", timeblockSchema);

module.exports = TimeBlock;