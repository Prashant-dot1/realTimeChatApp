const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    contacts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "UserRC"
        }
    ],
    bio : {
        type : String,
        default : "Available"
    },
    profilePic : {
        type : String,
    }
},{
    timestamps : true
});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.generateToken = (id,email) => {
    try{
        
        const token = jwt.sign({
            id : id,
            email : email,
        },"hello");

        return token;
    }
    catch(e){
        console.log("Error while generating a token")
    }
}

const User = mongoose.model("UserRC", userSchema);

module.exports = User;