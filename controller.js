const endpointsJson = require("./endpoints.json");
const { fetchAllTopics, fetchArticlesById } = require('./model');

// GET /api
exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJson })
};

// GET /api/topics
exports.getTopics = (req, res, next) => {
    fetchAllTopics()
      .then((topics) => {
        res.status(200).send({ topics });
      });
};

// GET /api/articles/:article_id
exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(Number(article_id))) {
    return next({
      status: 400,
      message: "Bad Request: article_id must be a number"
    });
  };
  fetchArticlesById(article_id)
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch(next);
};
