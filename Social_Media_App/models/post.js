const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    image:[{
        type:String,
        required:true,
    }],
    caption:{
        type:String,
    },
    comments:[{
        comment:{
            type:String
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

const Post = mongoose.model('post', postSchema);
module.exports = Post;