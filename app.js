const express = require('express');
const app = express();
const { 
  getApi,
  getAllTopics,
  getAllArticles,
  getAllUsers,
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

app.get('/api/users', getAllUsers);

app.get('/api/articles/:article_id', getArticle);

app.get('/api/articles/:article_id/comments', getComments);

app.post('/api/articles/:article_id/comments', postComments);

app.patch('/api/articles/:article_id', patchArticle);

app.delete('/api/comments/:comment_id', deleteComments);

// PostgreSQL error handler
app.use((err, req, res, next) => {
  if (err.code === '22P02') { 
    res.status(400).send({ message: "Bad Request: Invalid input syntax" });
  } else if (err.code === "23502") {
    res.status(400).send({ message: "Bad Request: Missing required data" });
  } else if (err.code === '23503') { 
    // Postgres foreign key violation
    res.status(404).send({ message: "Not Found: Resource does not exist" });
  } else if (err.code === '42703') { 
    // Postgres invalid column name
    res.status(400).send({ message: "Bad Request: Invalid column name in query" });
  } else {
    next(err); // Pass to the next error handler
  }
});

// Custom error handler
app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message })
    }
    else {
      console.log(err)
      res.status(500).send({ message: 'Internal Server Error '});
    };
});

// Catch-all for unknown routes
app.all("*", (req, res) => {
  res.status(404).send({ message: "Error: Endpoint Not Found" });
});

module.exports = app;