const express = require('express');
const router = express.Router();
const { getOrders, createOrder, deleteOrder, updateOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getOrders).post(protect, createOrder);
router.route('/:id').delete(protect, deleteOrder).put(protect, updateOrder);

module.exports = router;
