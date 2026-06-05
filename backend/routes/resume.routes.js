const express = require('express');
const router = express.Router();
const {
    uploadResume,
    getAllResumes,
    getResumeAnalysis,
    deleteResume
} = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../config/multer');

// @route   POST /api/resume/upload
router.post('/upload', protect, upload.single('resume'), uploadResume);

// @route   GET /api/resume/all
router.get('/all', protect, getAllResumes);

// @route   GET /api/resume/:id
router.get('/:id', protect, getResumeAnalysis);

// @route   DELETE /api/resume/:id
router.delete('/:id', protect, deleteResume);

module.exports = router;