// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(cors()); // Enable CORS for all requests
// app.use(bodyParser.json()); // Parse JSON bodies
// app.use(express.static('frontend')); // Serve static files from 'frontend' folder

// // Route to serve home.html
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
// });

// // Temporary storage for sensor data
// let sensorData = {
//     temperature: null,
//     humidity: null,
//     flameDetected: null,
//     smokeDetected: null,
// };

// // Endpoint to receive sensor data from the Arduino
// app.post('/sensor-data', (req, res) => {
//     const { temperature, humidity, mq2Value, flameValue } = req.body;
//     sensorData.temperature = temperature;
//     sensorData.humidity = humidity;
//     sensorData.flameDetected = flameValue === "1";
//     sensorData.smokeDetected = mq2Value === "1";

//     console.log(`Received sensor data: ${JSON.stringify(sensorData)}`);
//     res.send('Sensor data received');
// });

// // Endpoint to get sensor data
// app.get('/sensor-data', (req, res) => {
//     res.json(sensorData);
// });

// // Endpoint to receive robot start/stop commands
// app.post('/start?', (req, res) => {
//     console.log('Robot started');
//     res.json({ message: 'Robot started' });
// });

// app.post('/stop?', (req, res) => {
//     console.log('Robot stopped');
//     res.json({ message: 'Robot stopped' });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static('frontend')); // Serve static files from the 'frontend' folder

// Dummy user data (replace this with a database in production)
const users = [
    { username: 'admin', password: 'password' },
    { username: 'user', password: '123456' },
];

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password match
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        // Generate a JWT token
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Middleware to authenticate tokens
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
}

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}! You have accessed a protected route.` });
});

// Default route (serves login.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/home.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
