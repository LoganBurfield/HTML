const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const {google} = require('googleapis');

const app = express();

// Initialize Middleware
// app.use(logger);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Runs API Routes
app.use('/api/runs', require('./routes/api/runs'));
app.use('/api/schedule', require('./routes/api/schedule'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));