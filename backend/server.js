const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/src')));
app.use(express.static(path.join(__dirname, '../frontend/src/pages')));
app.use(express.static(path.join(__dirname, '../frontend/src/css')));
app.use(express.static(path.join(__dirname, '../frontend/src/js')));


// API Routes
app.use('/api/resume', require('./routes/resume.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/history', require('./routes/history.routes'));
app.use('/api/email', require('./routes/email.routes'));
app.use('/api/google', require('./routes/google.routes'));

// HTML page routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/pages/dashboard.html'));
});

app.get('/history.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/pages/history.html'));
});

// Catch all — serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'));
});

// Error middleware
app.use(require('./middleware/error.middleware'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});