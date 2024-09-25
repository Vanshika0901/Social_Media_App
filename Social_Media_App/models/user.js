const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    profile:{
        type: String,
       // required: true,
    },
    bio:{
        type: String,
        required: false,
    },
    gender:{
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }],
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    isActive:{
        type: Boolean,
        required:true
    },
    accountType:{
       type:String,
       enum: ['Public', 'Private'],
       default: "Public"
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;