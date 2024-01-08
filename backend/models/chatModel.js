const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    chatName : {
        type : String,
    },
    isGroup : {
        type : Boolean,
        default : false
    },
    users : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "UserRC"
        }
    ],
    latestMessage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message"
    },
    groupAdmin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserRC"
    },
    photo : {
        type : String,
    }
},{
    timestamps : true
});

const Chat = mongoose.model("Chat" , chatSchema);

module.exports = Chat;