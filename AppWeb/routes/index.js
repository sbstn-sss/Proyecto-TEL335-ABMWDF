'use strict'

const express = require('express');
const router = express.Router();

router
.get('/', (req, res) => {
    res.sendFile("index.html");
}).get('/integrantes', (req, res) => {
    res.sendFile(__dirname.replace("\\routes", "\\views") + "\\integrantes.html");
}).get('/acerca', (req, res) => {
    res.sendFile(__dirname.replace("\\routes", "\\views") + "\\acerca.html");
})

module.exports = router;