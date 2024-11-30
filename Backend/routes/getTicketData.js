const express = require('express');
const router = express.Router();
const OrderConfirmed = require('../Models/OrderConfirmed');
const authenticate = require("../middleware/authenticate");

// Route to fetch ticket data based on txnId
router.get('/', async (req, res) => {
  const { txnid } = req.query;

  try {
    // Find the order with the given txnId
    console.log(txnid);
    const order = await OrderConfirmed.findOne({ txnid: txnid });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Send the order details as a JSON response
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'An error occurred while fetching the order.' });
  }
});

router.get('/all', async (req, res) => {
  try {
    // Fetch all tickets from the OrderConfirmed collection
    const orders = await OrderConfirmed.find();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No tickets found.' });
    }

    // Send the list of tickets as a JSON response
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'An error occurred while fetching tickets.' });
  }
});

module.exports = router;
