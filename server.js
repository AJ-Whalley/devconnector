const express = require('express');
const mongoose = require('mongoose');
const app = express();

//Routes
const userRoutes = require('./routes/api/user');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require('./routes/api/posts');

// DB Config
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('Connected to MongoDB mLab'))
    .catch((err) => console.log(err.message));

const PORT = process.env.PORT || 5000

//Route distribution
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

app.listen(PORT, () => console.log(`We are connected to port ${PORT}`))