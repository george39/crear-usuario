'use strict'

var mongoose = require('mongoose');
var app = require('./app');


mongoose.connect('mongodb://localhost:27017/mensajeros', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    }
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Exress server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});