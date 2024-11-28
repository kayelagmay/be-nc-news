const endpointsJson = require("./endpoints.json")
const { 
  checkArticleExists,
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateVotes
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

// GET /api/articles
exports.getAllArticles = (req, res, next) => {
  const { sort_by, order_by } = req.query
      fetchAllArticles(sort_by, order_by)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
};

// GET /api/articles/:article_id
exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(Number(article_id))) {
    return next({
      status: 400,
      message: "Bad Request: article_id must be a number"
    });
  };
  fetchArticleById(article_id)
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch(next);
};

// GET /api/articles/:article_id/comments
exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(Number(article_id))) {
    return next({
      status: 400,
      message: "Bad Request: article_id must be a number"
    });
  };
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
  if (isNaN(Number(article_id))) {
    return next({
      status: 400,
      message: "Bad Request: article_id must be a number",
    });
  };
  if (!username || !body) {
    return next({
      status: 400,
      message: "Bad Request: username and body are required"
    });
  };
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
  if (inc_votes === undefined) {
    return next({
      status: 400,
      message: "Bad Request: inc_votes is required"
    });
  };
  if (typeof inc_votes !== "number") {
    return next({
      status: 400,
      message: "Bad Request: inc_votes must be a number",
    });
  };
  if (isNaN(Number(article_id))) {
    return next({
      status: 400,
      message: "Bad Request: article_id must be a number",
    });
  }; 
  checkArticleExists(article_id)
  .then(() => {
    return updateVotes(inc_votes, article_id)
  })
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch(next)
}