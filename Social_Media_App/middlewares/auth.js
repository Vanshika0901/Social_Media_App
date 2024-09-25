const {getUser} = require("../service/auth");

async function restrictedToLoggedInUser(req, res, next){
    let token = req.header.authorization || req.headers.Authorization;
    token = token.split(" ")[1];
    if(!token){
        return res.status(404).json({
            message: "Please login first!",
        })
    }

    const user  = getUser(token);
    if(!user){
        return res.status(404).json({
            message:"User not found",
        })
    }

    req.user = user;
    next();
}

module.exports = restrictedToLoggedInUser;