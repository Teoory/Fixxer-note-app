const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        min: 6,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please provide a email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    tags: {
        type: [String],
        enum: ['admin', 'editor', 'writer', 'user'],
        default: ['user']
    },
    profilePhoto: {
        type: String,
        default: 'https://fiyasko-blog-app.s3.eu-central-1.amazonaws.com/profilePhotos/default.jpg'
    },
    upvotedNotes: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Note' 
    }]
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;