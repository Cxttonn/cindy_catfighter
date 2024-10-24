const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static('frontend')); // Serve static files from 'frontend' folder

// Route to serve home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});

// Temporary storage for sensor data
let sensorData = {
    temperature: null,
    humidity: null,
    flameDetected: null,
    smokeDetected: null,
};

// Endpoint to receive sensor data from the Arduino
app.post('/sensor-data', (req, res) => {
    const { temperature, humidity, mq2Value, flameValue } = req.body;
    sensorData.temperature = temperature;
    sensorData.humidity = humidity;
    sensorData.flameDetected = flameValue === "1";
    sensorData.smokeDetected = mq2Value === "1";

    console.log(`Received sensor data: ${JSON.stringify(sensorData)}`);
    res.send('Sensor data received');
});

// Endpoint to get sensor data
app.get('/sensor-data', (req, res) => {
    res.json(sensorData);
});

// Endpoint to receive robot start/stop commands
app.post('/start?', (req, res) => {
    console.log('Robot started');
    res.json({ message: 'Robot started' });
});

app.post('/stop?', (req, res) => {
    console.log('Robot stopped');
    res.json({ message: 'Robot stopped' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
