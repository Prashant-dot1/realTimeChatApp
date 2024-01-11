const mongoose = require("mongoose");
require('dotenv').config();

// connect to mongoDB
const mongoDBconnect = () => {
    try{
        mongoose.connect(process.env.MONGODBURL);        
    }
    catch(e){
        console.log(`Error connecting to the database ${e}`);
    }
}

module.exports = mongoDBconnect;