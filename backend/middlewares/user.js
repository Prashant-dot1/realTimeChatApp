const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
 
const userMiddleware = async function (req,res,next) {

    try{
        const token  = req.headers.authorization.split("Bearer ")[1]; // bearer token
        console.log(token)
        if(token.length < 500){
            const verifyUser = jwt.verify(token, "hello");
            
            console.log(JSON.stringify(verifyUser));
            if(verifyUser){
                // console.log(verifyUser);
                const rootUser = await User.findOne({
                    _id : verifyUser.id
                }).select("-password"); // except password give me everything

                req.token = token;
                req.rootUser = rootUser;
                req.rootUserId = rootUser.id;
                next();
            }
        }else{
            res.status(403).json({
                msg : "User is not registered, please signup and login again"
            })
            return;
        }
    } catch(err){
        res.status(400).json({
            msg : `Error occured - ${err}`
        })
    }

}

module.exports = { userMiddleware };