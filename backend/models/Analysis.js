const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    skills: {
        type: [String],
        default: []
    },
    missingSkills: {
        type: [String],
        default: []
    },
    keywords: {
        type: [String],
        default: []
    },
    atsScore: {
        type: Number,
        default: 0
    },
    suggestions: {
        type: [String],
        default: []
    },
    summary: {
        type: String,
        default: ''
    },
    analyzedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Analysis', analysisSchema);