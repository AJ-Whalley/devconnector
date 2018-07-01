const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// Create express app
const app = express();

//Routes
const usersRoutes = require('./routes/api/users');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require('./routes/api/posts');

//Body parser middleware 
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('Connected to MongoDB mLab'))
    .catch((err) => console.log(err.message));

//Passport middleware    
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);

//Route distribution
app.use('/api/users', usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

//Listen to port 
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`We are connected to port ${PORT}`))