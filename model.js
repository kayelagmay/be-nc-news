const db = require('./db/connection');
const format = require('pg-format');

exports.fetchAllTopics = () => {
  return db
    .query('SELECT * FROM topics;')
    .then((result) => {
      return result.rows;
    });
};

exports.fetchAllArticles = (sort_by = "created_at", order_by = "desc") => {
  const validSortBy = ["article_id", "author", "title", "topic", "created_at", "votes"];
  const validOrderBy = ["asc", "desc"];
  if (!validSortBy.includes(sort_by) || !validOrderBy.includes(order_by)) {
    return Promise.reject({ status: 400, message: "Bad Request: Invalid Query"})
  }
  return db
  .query(`SELECT 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order_by};`)
  .then((results) => {
    return results.rows;
  });
};


exports.fetchArticleById = (article_id) => {
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

exports.fetchCommentsByArticleId = (article_id) => {
  return db
  .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `Not Found: no article found for article_id ${article_id}`
      });
    }
    return db
    .query(`SELECT 
      comment_id,
      votes,
      created_at,
      author,
      body,
      article_id
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;`, 
      [article_id])
    .then((results) => {
      return results.rows;
    });
  });
};

