require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { SERVER_PORT } = process.env
const favoriteAnime = require('./animeDB.json');
const controller = require('./controller')

// middleware
app.use(express.json());
app.use(cors());

// seeded data
app.post('/seed', controller.seed)

// routes
app.post('/addFavAnime', controller.addFavAnime)
app.get('/getAllFavAnime', controller.getAllFavAnime)
app.put('/updateFavAnime/:id', controller.updateFavAnime)
app.delete('/deleteFavAnime/:id', controller.deleteFavAnime)

// port
app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))