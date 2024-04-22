const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        min: 6,
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
    upvotedNotes: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Note' 
    }]
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;