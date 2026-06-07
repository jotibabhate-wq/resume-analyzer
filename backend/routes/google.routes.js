const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Verify Google token
const verifyGoogleToken = async (credential) => {
    try {
        const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
        );
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return {
            email: data.email,
            name: data.name,
            picture: data.picture,
            googleId: data.sub
        };
    } catch (error) {
        throw new Error('Token verification failed: ' + error.message);
    }
};

// @route   POST /api/google/login
router.post('/login', async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: 'Google credential is required'
            });
        }

        console.log('🔐 Google login attempt...');

        // Verify Google token
        const { email, name, picture, googleId } = await verifyGoogleToken(credential);

        console.log('✅ Google token verified for:', email);

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            user.picture = picture;
            user.googleId = googleId;
            await user.save();

            return res.status(200).json({
                success: true,
                message: 'Google login successful',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    picture: picture,
                    token: generateToken(user._id)
                }
            });
        }

        // Create new user
        user = await User.create({
            name,
            email,
            password: `google_${googleId}_${Date.now()}`,
            googleId,
            picture
        });

        res.status(201).json({
            success: true,
            message: 'Google registration successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: picture,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        console.error('❌ Google Auth Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Google authentication failed: ' + error.message
        });
    }
});

module.exports = router;