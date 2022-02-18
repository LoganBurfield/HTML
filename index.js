const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const logger = require('./middleware/logger');
const match = require('./Schedule');


const app = express();

// Initialize Middleware
// app.use(logger);

// Handlebars Middleware
var hbs = exphbs.create({defaultLayout: 'main'});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Set static folder (***UNCOMMENT AFTER HANDLEBARS TESTING***)
// app.use(express.static(path.join(__dirname, 'public')));

// Scouting Tool  Route
app.get('/', (req, res) => res.render('index', {
    title: 'Schedule Tool',
    match
}));

// Runs API Routes
app.use('/api/runs', require('./routes/api/runs'));
app.use('/api/schedule', require('./routes/api/schedule'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));