const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    material: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    },
    size: {
        type: String,
        required: false
    },
    noOfLogos: {
        type: Number,
        required: false
    },
    deadline: {
        type: String, // Storing as string for simplicity now, could be Date
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'bidding', 'in-progress', 'completed'],
        default: 'pending'
    },
    manufacturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    winningBid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
        required: false
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
