const endpointsJson = require("./endpoints.json")
const { 
  checkArticleExists,
  checkCommentExists,
  checkTopicExists,
  fetchAllTopics,
  fetchAllArticles,
  fetchAllUsers,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateVotes, 
  removeCommentById
 } = require('./model');

// GET /api
exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson })
};

// GET /api/topics
exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    });
};

// GET /api/users
exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
  .then((users) => {
    res.status(200).send({ users });
  })
}

// GET /api/articles
exports.getAllArticles = (req, res, next) => {
  const { sort_by, order_by, topic } = req.query
  const promise = [];
  if (topic) {
    promise.push(checkTopicExists(topic))
  }
  Promise.all(promise)
  .then(() => {
    return fetchAllArticles(sort_by, order_by, topic);
  })
  .then((articles) => {
    res.status(200).send({ articles });
  })
  .catch(next);
};

// GET /api/articles/:article_id
exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch(next);
};

// GET /api/articles/:article_id/comments
exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  checkArticleExists(article_id)
  .then(() => {
    return fetchCommentsByArticleId(article_id)
  })
  .then((comments) => {
    res.status(200).send({ comments });
  })
  .catch(next);
};

// POST /api/articles/:article_id/comments
exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  checkArticleExists(article_id)
  .then(() => {
    return insertComment(article_id, username, body);
  })
  .then((newComment) => {
    res.status(201).send({ comment: newComment });
  })
  .catch(next);
};

// PATCH /api/articles/:article_id
exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  checkArticleExists(article_id)
  .then(() => {
    return updateVotes(inc_votes, article_id)
  })
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch(next)
}

// DELETE /api/comments/:comment_id
exports.deleteComments = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
  .then(() => {
    res.status(204).send();
  })
  .catch(next);
};