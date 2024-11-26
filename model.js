const db = require('./db/connection');
const format = require('pg-format');

exports.fetchAllTopics = () => {
  return db
    .query('SELECT * FROM topics;')
    .then((result) => {
      return result.rows;
    });
};

exports.fetchArticlesById = (article_id) => {
  return db
  .query(`SELECT * FROM articles
    WHERE article_id = $1;`,
    [article_id])
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `Not Found: no article found for article_id ${article_id}`
      })
    };
    return result.rows[0];
  });
};