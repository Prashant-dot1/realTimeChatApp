const { parse } = require("dotenv");
const Chat = require("../models/chatModel");
const User = require("../models/userSchema");

const accessChats = async (req,res) => {

    const {userId}  = req.body;
    if(!userId) {
        res.send({ message: "Provide User's Id" });
    }

    let chatExists = await Chat.find({
        isGroup : false,
        $and : [
            {users : {$elemMatch : {$eq : userId}}},
            {users : { $elemMatch : {$eq : req.rootUserId}}}
        ]
    }).populate("users" , "-password")
    .populate("latestMessage");

    chatExists = await User.populate(chatExists , {
        path : "latestMessage.sender",
        select : "name email profilePic"
    });

    if(chatExists.length > 0 ){
        res.status(200).send(chatExists[0]);
    }
    else{
        let data = {
            chatName : "sender",
            users : [userId , req.rootUserId],
            isGroup : false
        };

        try{
            const newChat = await Chat.create(data);
            const chat = await Chat.find({_id : newChat._id}).populate(
                "users",
                "-password"
            );
            res.status(200).json(chat);
        } catch (err){
            res.status(500).send(err);
        }
    }
}

const fetchAllChats = async (req,res) => {

    try{
        const chats = await Chat.find({
            users : {$elemMatch : {$eq : req.rootUserId}}
        }).populate("users")
        .populate("latestMessage")
        .populate("groupAdmin")
        .sort({updatedAt : -1})

        const finalChats = await User.populate(chats , {
            path : "latestMessage.sender",
            select : "name email profilePic"
        });

        res.status(200).json({
            finalChats
        });
    }catch(e){
        res.status(500).send(e);
        console.log(e);
    }
}

const createGroup = async (req,res) => {
    const {chatName , users} = req.body;
    console.log(req.body);

    if(!chatName || !users) {
        return res.status(400).json({
            message : "Need to have name and users to create a group"
        })
    }
    const parsedUsers = JSON.parse(users);
    // const parsedUsers = users;
    if(parsedUsers.length < 2){
        return res.status(400).json({
            msg : "Group should've more than 2 users"
        })
    }
    parsedUsers.push(req.rootUser);
    try{
        const chat = await Chat.create({
            chatName : chatName,
            users : parsedUsers,
            isGroup : true,
            groupAdmin : req.rootUserId
        });

        const createdChat = await Chat.findOne({
            _id : chat._id
        }).populate("users" , "-password")
        .populate("groupAdmin","-password");

        res.status(200).json(createdChat);
    }
    catch(e){
        res.status(500).json({
            msg : `Error ${e}`
        })
    }
}

const renameGroup = async (req,res) => {
    const {chatId , chatName} = req.body;
    if(!chatId || !chatName){
        res.status(400).send("please provide chatId and chatName");
    }
    try{
        const chat = await Chat.findByIdAndUpdate(chatId , {
            $set : {chatName : chatName}
        }).populate("users", "-password")
        .populate("groupAdmin","-password")

        res.status(200).send(chat);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    }
}

const addToGroup = async (req,res) => {
    const {chatId , userId}  = req.body;
    const existingChat = await Chat.findOne({_id : chatId});

    if(!existingChat.users.includes(userId)){
        let chat = await Chat.findByIdAndUpdate(chatId , {
            $push : {users : userId}
        })

        chat = await Chat.findOne({_id : chatId}).populate("users","-password").populate("groupAdmin", "-password");

        if(!chat){
            res.status(404).send("chat not found");
        }
        else{
            res.status(200).send(chat);
        }
    }else{
        res.status(409).send("user already exists in the group");
    }

}

const removeFromGroup = async (req,res) => {
    const {userId , chatId} = req.body;

    const existingChat = await Chat.findOne({_id : chatId});
    if(existingChat.users.includes(userId)){
        try{

            let chat = await Chat.findByIdAndUpdate(chatId , {
                $pull : {users : userId}
            })
            chat = await Chat.findOne({_id : chatId}).populate("users","-password").populate("groupAdmin","-password");
            
            res.status(200).send(chat);
        }
        catch(e){
            res.status(404).send(e);
        }
    }
    else{
        res.status(409).send("user doesnot exists in the group");
    }

}

module.exports = {accessChats , fetchAllChats , createGroup , renameGroup , addToGroup , removeFromGroup};