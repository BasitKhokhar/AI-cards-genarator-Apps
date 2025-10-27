require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require("./routes/CardsRoutes");

// const ModelRoutes = require("./routes/ModelRoutes");

const FavouriteTempRoutes = require('./routes/FavouriteTempRoutes');

const ModelRoutes = require('./routes/ModelRoutes');


const paymentRoutes = require('./routes/paymentRoutes');
const contentRoutes = require('./routes/contentRoutes');

const splashScreensRoutes = require('./routes/splashScreensRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Route groups
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use("/cards", cardRoutes);

// app.use("/model", ModelRoutes);

app.use('/favourites', FavouriteTempRoutes);

app.use('/Model', ModelRoutes);


app.use('/payments', paymentRoutes);
app.use('/content', contentRoutes);

app.use('/splashscreens', splashScreensRoutes);

app.get('/', (req, res) => res.send("Basit's modular backend is live 🚀"));

module.exports = app;