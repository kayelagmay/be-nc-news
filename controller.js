const endpointsJson = require("./endpoints.json")
const { fetchAllTopics, fetchAllArticles, fetchArticleById } = require('./model');

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
