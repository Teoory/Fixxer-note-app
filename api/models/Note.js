const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title']
    },
    content: {
        type: String,
        required: [true, 'Please provide a content'],
    },
    tags: {
        type: [String],
        enum: ['working', 'done', 'pending'],
        default: ['pending']
    },
    upvotes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

const NoteModel = model('Note', NoteSchema);

module.exports = NoteModel;