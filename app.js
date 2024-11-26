const express = require('express');
const app = express();
const { getApi, getTopics, getArticles } = require('./controller');

// app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticles);

// General error handler
app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message })
    }
    else {
      res.status(500).send({ message: 'Internal Server Error '});
    };
});

// Catch-all for unknown routes
app.all("*", (req, res) => {
  res.status(404).send({ message: "Endpoint Not Found" });
});

module.exports = app;