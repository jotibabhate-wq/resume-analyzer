const path = require('path');
const fs = require('fs');

// Get file extension
const getFileExtension = (filename) => {
    return path.extname(filename).toLowerCase();
};

// Check if file exists
const fileExists = (filePath) => {
    return fs.existsSync(filePath);
};

// Delete file from disk
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
        return false;
    }
};

// Get file size in KB or MB
const getFileSize = (filePath) => {
    try {
        const stats = fs.statSync(filePath);
        const sizeInBytes = stats.size;
        if (sizeInBytes < 1024 * 1024) {
            return `${(sizeInBytes / 1024).toFixed(2)} KB`;
        }
        return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    } catch (error) {
        return 'Unknown';
    }
};

// Validate file type
const isValidFileType = (filename) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = getFileExtension(filename);
    return allowedTypes.includes(ext);
};

module.exports = {
    getFileExtension,
    fileExists,
    deleteFile,
    getFileSize,
    isValidFileType
};