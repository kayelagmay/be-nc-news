const express = require('express');
const app = express();
const { 
  getApi,
  getAllTopics,
  getAllArticles,
  getArticle,
  getComments,
  postComments,
  patchArticle,
  deleteComments
} = require('./controller');

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id', getArticle);

app.get('/api/articles/:article_id/comments', getComments);

app.post('/api/articles/:article_id/comments', postComments);

app.patch('/api/articles/:article_id', patchArticle);

app.delete('/api/comments/:comment_id', deleteComments);

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
  res.status(404).send({ message: "Error: Endpoint Not Found" });
});

module.exports = app;