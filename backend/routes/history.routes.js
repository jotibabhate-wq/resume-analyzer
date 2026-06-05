const express = require('express');
const router = express.Router();
const Analysis = require('../models/Analysis');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/history
// @desc    Get all analysis history for logged in user
router.get('/', protect, async (req, res) => {
    try {
        const history = await Analysis.find({ user: req.user._id })
            .populate('resume')
            .sort({ analyzedAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/history/:id
// @desc    Delete single history record
router.delete('/:id', protect, async (req, res) => {
    try {
        const analysis = await Analysis.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'History record not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'History record deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/history
// @desc    Clear all history for logged in user
router.delete('/', protect, async (req, res) => {
    try {
        await Analysis.deleteMany({ user: req.user._id });

        res.status(200).json({
            success: true,
            message: 'All history cleared successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;