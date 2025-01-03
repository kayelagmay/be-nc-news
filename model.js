const db = require('./db/connection');
const format = require('pg-format');

// Re-usable helper function
exports.checkArticleExists = (article_id) => {
  return db
  .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `Not Found: no article found for article_id ${article_id}`
      });
    };
  });
};

// Re-usable helper function
exports.checkTopicExists = (topic) => {
  return db
  .query('SELECT * FROM topics WHERE slug = $1', [topic])
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `Not Found: ${topic} topic does not exist`
      });
    };
  });
};

exports.fetchAllTopics = () => {
  return db
    .query('SELECT * FROM topics;')
    .then((result) => {
      return result.rows;
    });
};

exports.fetchAllArticles = (sort_by = "created_at", order_by = "DESC", topic) => {
  const validSortBy = ["article_id", "author", "title", "topic", "created_at", "votes", "article_img_url"];
  const validOrderBy = ["ASC", "DESC"];
  if (!validSortBy.includes(sort_by) || !validOrderBy.includes(order_by)) {
    return Promise.reject({ status: 400, message: "Bad Request: Invalid Query"})
  };
  let query = `SELECT 
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
    ON articles.article_id = comments.article_id`;
  const queryValues = [];
  if (topic) {
    query += ` WHERE articles.topic = $1`;
    queryValues.push(topic)
  }
  query += `
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order_by};`
  return db
  .query(query, queryValues)
  .then((results) => {
    return results.rows;
  });
};

exports.fetchAllUsers = () => {
  return db
  .query('SELECT * FROM users;')
  .then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
  .query(`SELECT articles.*, COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
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
};

exports.insertComment = (article_id, username, body) => {
  return db
  .query(`
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;`,
  [article_id, username, body])
  .then((result) => {
    return result.rows[0];
  })
}

exports.updateVotes = (inc_votes, article_id) => {
  return db
  .query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
    [inc_votes, article_id]
  )
  .then((result) => {
    return result.rows[0];
  });
};

exports.removeCommentById = (comment_id) => {
  return db
  .query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`,
    [comment_id]
  )
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `Not Found: no comment found for comment_id ${comment_id}`
      });
    };
  });
};