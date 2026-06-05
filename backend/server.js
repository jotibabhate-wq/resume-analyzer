const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes - API routes FIRST (सर्वात आधी)
app.use('/api/resume', require('./routes/resume.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/history', require('./routes/history.routes'));

// ✅ Static files - SECOND (नंतर)
app.use(express.static(path.join(__dirname, '../frontend/src')));
app.use(express.static(path.join(__dirname, '../frontend/src/css')));
app.use(express.static(path.join(__dirname, '../frontend/src/js')));

// ✅ Serve HTML pages - THIRD
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/pages/dashboard.html'));
});

app.get('/history.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/pages/history.html'));
});

// ✅ 404 handler - LAST (सगळ्यात शेवटी)
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error middleware
app.use(require('./middleware/error.middleware'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});