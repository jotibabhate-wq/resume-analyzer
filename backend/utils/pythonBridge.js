const { spawn } = require('child_process');
const path = require('path');

const analyzeResume = (filePath) => {
    return new Promise((resolve, reject) => {
        // Path to Python main.py
        const pythonScript = path.join(__dirname, '../../ai_engine/main.py');

        // Spawn Python process
        const python = spawn(process.env.PYTHON_PATH || 'python', [
            pythonScript,
            filePath
        ]);

        let result = '';
        let error = '';

        // Collect data from Python script
        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        // Collect error from Python script
        python.stderr.on('data', (data) => {
            error += data.toString();
        });

        // When Python process finishes
        python.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python Error: ${error}`));
            } else {
                try {
                    const parsed = JSON.parse(result);
                    resolve(parsed);
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${result}`));
                }
            }
        });

        // Handle process error
        python.on('error', (err) => {
            reject(new Error(`Failed to start Python process: ${err.message}`));
        });
    });
};

module.exports = { analyzeResume };