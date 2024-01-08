const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserRC"
    },
    message : {
        type : String,
        trim : true
    },
    chatId : {
        type : mongoose.Schema.Types.ObjectId,
        refs : "Chat"
    }
},{
    timestamps : true
})

const Messsage = mongoose.model("Message" , messageSchema);

module.exports = Messsage;