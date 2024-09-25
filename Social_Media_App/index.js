const express = require("express");
const connectToMongoDB = require("./database/mongoDB/connection");
require("dotenv").config();
const app = express();

app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Server started successfully at PORT: ${PORT}`);
})