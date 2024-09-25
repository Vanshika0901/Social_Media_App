const mongoose = require("mongoose");

const PORT = process.env.PORT;
const databaseName = process.env.DATABASE_NAME;

async function connectToMongoDB(url){
    try{
        await mongoose.connect(`mongodb://localhost:${PORT}/${databaseName}`);
        console.log("MongoDB connected successfully");
    }
    catch(error){
        console.log("Error occured while connecting to mongoDB", error);
    }

}

module.exports = connectToMongoDB;