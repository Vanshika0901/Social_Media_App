const jwt = require("jsonwebtoken");
require("dotenv").config();

const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;

function generateAccessToken(user){
        return jwt.sign(user,ACCESS_SECRET_KEY, {expiresIn: "2h"});
}

function generateRefreshToken(user){
    return jwt.sign(user,REFRESH_SECRET_KEY, {expiresIn: "2d"});
}

async function getUserFromAccessToken(token){
    try{
        const user = jwt.verify(token, ACCESS_SECRET_KEY);
        return user;
    }
    catch(error){
        return null;
    }
}

async function getUserFromRefreshToken(token){
    try{
        const user = jwt.verify(token, REFRESH_SECRET_KEY);
        return user;
    }
    catch(error){
        return null;
    }
}

module.exports = {generateAccessToken, getUserFromAccessToken, generateRefreshToken, getUserFromRefreshToken};