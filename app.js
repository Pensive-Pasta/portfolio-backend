const express = require('express');
const fs = require('fs');
const app = express();
const PORT = require('./config');

app.use(express.json());

app.get('/projects', (req, res) => {
    fs.readFile('projects.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
