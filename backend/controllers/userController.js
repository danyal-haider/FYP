const User = require('../models/User');
const Order = require('../models/Order');
const generateToken = (id) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyName: user.companyName
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        console.log("updateUserProfile called");
        console.log("User retrieved from token:", req.user ? req.user._id : "No user");

        const user = await User.findById(req.user._id);
        console.log("User found in DB:", user ? "Yes" : "No");

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            // Handle companyName carefully
            const newCompanyName = req.body.companyName;
            console.log("New Company Name:", newCompanyName);

            if (newCompanyName !== undefined) {
                user.companyName = newCompanyName;
            } else if (!user.companyName) {
                user.companyName = '';
            }

            if (req.body.password) {
                console.log("Updating password...");
                user.password = req.body.password;
            }

            console.log("Attempting to save user...");
            const updatedUser = await user.save();
            console.log("User saved successfully");

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                companyName: updatedUser.companyName,
                token: generateToken(updatedUser._id),
            });
        } else {
            console.log("User not found via findById");
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Update Profile CRITICAL Error:", error);
        res.status(500).json({ message: error.message || 'Server Error updating profile' });
    }
};

const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Delete all orders by this user
            await Order.deleteMany({ user: req.params.id });

            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'User and their orders removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
};
