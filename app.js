require('dotenv').config({path: './middelware/.env'})
const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')

const userRoute = require('./route/user');
const stuffRoute = require('./route/stuff');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

mongoose.connect('mongodb+srv://tutiboss:Quentin40600@cluster0.ejdjv.mongodb.net/projet6?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParse.json());

app.use('/images', express.static(path.join(__dirname, 'image')));

app.use('/api/auth', userRoute);
app.use('/api', stuffRoute);

module.exports = app;