const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const ItemSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    itemName : {
        type : String,
        required : true
    },
    Description : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true,
        enum : ['Lost', 'Found']
    },
    Location :{
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    },
    contactInfo :{
        type : Number,
        required : true
    }
})

module.exports = mongoose.model("Item", ItemSchema);