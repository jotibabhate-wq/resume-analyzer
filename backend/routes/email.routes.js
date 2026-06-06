const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Analysis = require('../models/Analysis');
const User = require('../models/User');
const { sendAnalysisReport } = require('../utils/emailService');

// @route   POST /api/email/send-report
// @desc    Send analysis report to email
router.post('/send-report', protect, async (req, res) => {
    try {
        const { analysisId } = req.body;

        // Get user
        const user = await User.findById(req.user._id);

        // Get analysis
        const analysis = await Analysis.findOne({
            _id: analysisId,
            user: req.user._id
        }).populate('resume');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        // Send email
        const result = await sendAnalysisReport(
            user.email,
            user.name,
            analysis,
            analysis.resume?.fileName || 'Resume'
        );

        if (result.success) {
            res.status(200).json({
                success: true,
                message: `Report sent to ${user.email} successfully!`
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send email'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;