const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    kar: {
        type: Number,
        required: [true, 'Please provide a kar'],
    },
    karOran: {
        type: Number,
        required: [true, 'Please provide a karOran'],
    },
    vergi: {
        type: Number,
        required: [true, 'Please provide a vergi'],
    },
    total: {
        type: Number,
        required: [true, 'Please provide a total'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

const ProductModel = model('Product', ProductSchema);

module.exports = ProductModel;