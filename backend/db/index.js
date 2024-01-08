const mongoose = require("mongoose");


// connect to mongoDB
const mongoDBconnect = () => {
    try{
        mongoose.connect("mongodb+srv://deployuser:admin123@ecommerceapplication.vbgqffn.mongodb.net/");        
    }
    catch(e){
        console.log(`Error connecting to the database ${e}`);
    }
}

module.exports = mongoDBconnect;