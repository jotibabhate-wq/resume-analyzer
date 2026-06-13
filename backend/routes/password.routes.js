const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @route   POST /api/password/forgot
// @desc    Generate reset token and return reset URL
router.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide your email'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        // Check if Google account
        if (user.googleId) {
            return res.status(400).json({
                success: false,
                message: 'This account uses Google login. Please sign in with Google.'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save token to user
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
        await user.save();

        // Create reset URL
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://resume-analyzer-7y62.onrender.com'
            : 'http://localhost:5000';
        const resetUrl = `${baseUrl}/reset-password.html?token=${resetToken}&email=${email}`;

        // Return reset URL and user name to frontend
        // Frontend will send email via EmailJS
        res.status(200).json({
            success: true,
            resetUrl: resetUrl,
            userName: user.name,
            userEmail: email,
            message: 'Reset token generated'
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong: ' + error.message
        });
    }
});

// @route   POST /api/password/reset
// @desc    Reset password with token
router.post('/reset', async (req, res) => {
    try {
        const { token, email, password } = req.body;

        if (!token || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Hash token to compare
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            email,
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset link. Please request a new one.'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully! You can now login.'
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password: ' + error.message
        });
    }
});

module.exports = router;