const Message = require("../models/messageModel");
const User = require("../models/userSchema");
const Chat = require("../models/chatModel");

const sendMessage = async (req,res) => {

    const {chatId , message} = req.body;
    try{
        let msg = await Message.create({
            sender : req.rootUserId,
            message,
            chatId
        });

        msg = await msg.populate("sender" , "name profilepic email");
        msg = await msg.populate({
            path : "chatId",
            select : "chatName isGroup users",
            model : "Chat",
            populate: {
                path : "users",
                select : "name email profilepic",
                model : "UserRC",
            }
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage : msg
        })

        res.status(200).send(msg);
    }catch(e){
        console.log(e);
        res.status(500).json({
            msg : `Error occured ${e}`
        })
    }
}

const getMessage = async (req,res) => {

    const {chatId} = req.params;

    try{
        const message = await Message.find({
            chatId : chatId
        }).populate({
            path : "chatId",
            model : "Chat"
        }).populate({
            path : "sender",
            model : "UserRC",
            select : "name profilepic email"
        })

        res.status(200).json({
            message : message
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            msg : `Error occured ${e}`
        })
    }
}

module.exports = {sendMessage , getMessage}