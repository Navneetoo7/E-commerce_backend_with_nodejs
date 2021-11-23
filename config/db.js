const mongoose = require("mongoose");
const config = require("./keys");
const db =config.mongoURL;


const connectDB =  async () =>{
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        console.log("connected to DB")
    }catch(err){
        console.log("connection failed",err);
        process.exit(1);
    }
};

module.exports= connectDB;