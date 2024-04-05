const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        maxlength: [500, 'Message cannot be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

const ContactModel = model('Contact', ContactSchema);

module.exports = ContactModel;