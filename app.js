const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware for parsing body and session management
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// Dummy users for login
const users = [
    { username: 'admin', password: 'password' },
];

// Routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;
        console.log("Session after login:", req.session); // Debug session
        res.redirect('/home');
    } else {
        res.send('Invalid username or password. <a href="/login">Try again</a>');
    }
});

app.get('/home', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/map', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'frontend', 'map.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/report', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'frontend', 'report.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/home');
        }
        res.redirect('/login');
    });
});

// Route for receiving sensor data
app.post('/data', (req, res) => {
    const { temperature, humidity } = req.body;
    console.log(`Received Temperature: ${temperature}, Humidity: ${humidity}`);

    // Store data logic goes here (e.g., save to a database)

    res.send('Data received');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
