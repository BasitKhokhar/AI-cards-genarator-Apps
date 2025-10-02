require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require("./routes/CardsRoutes");
const imageRoutes = require('./routes/imageRoutes');
const videosRoutes = require('./routes/videosRoutes');
const replicateRoutes = require('./routes/replicateRoutes');
const openrouterRoutes = require('./routes/replicateRoutes');

const paymentRoutes = require('./routes/paymentRoutes');
const contentRoutes = require('./routes/contentRoutes');
const aiFeaturesRoutes = require('./routes/aiFeaturesRoutes');
const splashScreensRoutes = require('./routes/splashScreensRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Route groups
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use("/cards", cardRoutes);
app.use('/images', imageRoutes);
app.use('/videos', videosRoutes);
app.use('/replicate', replicateRoutes);
app.use('/openrouter', openrouterRoutes);

app.use('/payments', paymentRoutes);
app.use('/content', contentRoutes);
app.use('/aipicsfeatures', aiFeaturesRoutes);
app.use('/splashscreens', splashScreensRoutes);

app.get('/', (req, res) => res.send("Basit's modular backend is live 🚀"));

module.exports = app;