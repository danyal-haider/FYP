const Order = require('../models/Order');

// @desc    Get orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    const orders = await Order.find().populate('user', 'name email');
    res.status(200).json(orders);
};

// @desc    Set order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    if (!req.body.title || !req.body.quantity) {
        res.status(400).json({ message: 'Please add a title and quantity' });
        return;
    }

    const order = await Order.create({
        title: req.body.title,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price,
        // Optional custom details flattened
        material: req.body.customDetails?.material || req.body.material,
        color: req.body.customDetails?.color || req.body.color,
        size: req.body.customDetails?.size || req.body.size,
        noOfLogos: req.body.customDetails?.logos || req.body.noOfLogos,
        deadline: req.body.customDetails?.deadline || req.body.deadline,
        user: req.user.id
    });

    res.status(200).json(order);
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Check user
        if (order.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        if (order.status !== 'pending') {
            res.status(400);
            throw new Error('Cannot delete non-pending order');
        }

        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Check user
        if (order.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        if (order.status !== 'pending') {
            res.status(400);
            throw new Error('Cannot update non-pending order');
        }

        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOrders,
    createOrder,
    deleteOrder,
    updateOrder
};
