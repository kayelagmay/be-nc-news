const endpointsJson = require("./endpoints.json");
const { fetchAllTopics } = require('./model');

// GET /api
exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
};

// GET /api/topics
exports.getTopics = (req, res, next) => {
    fetchAllTopics()
      .then((topics) => {
        res.status(200).send({ topics });
      })
      .catch((err) => {
        next(err);
      });
};