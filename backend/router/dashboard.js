const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/dashboard',authMiddleware, (req, res) => {
    res.json({success: true, user: req.user });
});