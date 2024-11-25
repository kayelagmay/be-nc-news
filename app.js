const express = require('express');
const app = express();
const { getApi, getTopics } = require('./controller');

// app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.use((req, res) => {
    res.status(404).send({ message: 'Endpoint Not Found' });
  });

// General error handler
// app.use((err, req, res, next) => {
//     if (err.status && err.message) {
//         res.status(err.status).send({ message: err.message })
//     };
// });

module.exports = app;