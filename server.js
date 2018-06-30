const express = require('express');
const mongoose = require('mongoose');
const app = express();

// DB Config
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('Connected to MongoDB mLab'))
    .catch((err) => console.log(err.message));

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => res.status(200).send("Hello World!"))

app.listen(PORT, () => console.log(`We are connected to port ${PORT}`))