const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

const registerUser = async (req,res) => {

    const {firstname,lastname,email,password} = req.body;
    try{
        const existingUser = await User.findOne({email : email});
        if(existingUser){
            return res.status(400).json({
                error : "User already registere with this email"
            })
        }
        else{
            
            const newUser = await User.create({
                name : firstname + " " + lastname,
                email : email,
                password : password 
            });
            console.log(newUser);
            const token = await newUser.generateToken(newUser._id , newUser.email);
            res.status(200).json({
                msg : "successfully registered user",
                token : token
            })
        }
    }catch(err){
        res.status(500).json({
            msg : `Error occured ${err}`
        })
    }
}

const loginUser = async (req,res) => {

    const {email , password} = req.body;
    try{
        const user = await User.findOne({email});
        console.log(user);
        if(!user){
            res.status(200).json({
                message : "User does not exists"
            })
            return;
        }

        const validPass = await bcrypt.compare(password , user.password);
        if(!validPass){
            res.status(200).json({
                message : "Invalid creds"
            })
        }else{
            const token = user.generateToken(user._id, user.email);
            res.cookie("userToken" , token , {
                httpOnly : true
            })
            res.status(200).json({
                token : token,
            })
        }
    }
    catch(e){
        res.status(500).json({
            msg : `Error occured ${e}`
        })
    }

};


const validUser = async (req,res) => {
    try{
        const validUser = await User.findOne({
            _id : req.rootUserId
        }).select("-password")

        if(!validUser){
            return res.json({
                msg : "user is not valid"
            })
        }
        else{
            return res.status(200).json({
                user : validUser,
                token : req.token
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            msg : `Error occured ${err}`
        })
    }
}

module.exports = { registerUser , loginUser , validUser} ;