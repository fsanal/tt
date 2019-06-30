const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types

var bucketSchema = new Schema({
    boardID: ObjectId,
    created: Date,
    name: {type: String, required: true},
    numPosts: Number,
    url: String
});

var Bucket = mongoose.model("Bucket", bucketSchema);

module.exports = Bucket; 