const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Static files (HTML, CSS, JS) serve karne ke liye yeh line zaroori hai
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB Compass
mongoose.connect('mongodb://localhost:27017/shopverseDB')
    .then(() => console.log('Connected to ShopVerse MongoDB successfully!'))
    .catch(err => console.error('Connection error:', err));

// Customer Schema & Model
const customerSchema = new mongoose.Schema({
    name: String,
    phone: String,
    categoryPref: String,
    city: String,
    email: { type: String, unique: true },
    password: String
});

const Customer = mongoose.model('Customer', customerSchema);

// Order Schema & Model
const orderSchema = new mongoose.Schema({
    customerEmail: String,
    items: Array,
    totalAmount: Number,
    orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Registration Route
app.post('/api/register', async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        res.json({ success: true, message: "Account Created & Saved to MongoDB!" });
    } catch (err) {
        res.json({ success: false, message: "Error: Email already registered or invalid input." });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email, password });

        if (customer) {
            res.json({ success: true, customer });
        } else {
            res.json({ success: false, message: "Invalid Email or Password!" });
        }
    } catch (err) {
        res.json({ success: false, message: "Server error during login." });
    }
});

// Place Order Route
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.json({ success: true, message: "Order Placed Successfully!" });
    } catch (err) {
        res.json({ success: false, message: "Failed to place order." });
    }
});

app.listen(3000, () => {
    console.log('ShopVerse Server running on http://localhost:3000');
});