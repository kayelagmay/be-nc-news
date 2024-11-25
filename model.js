const db = require('./db/connection');
const format = require('pg-format');

exports.fetchAllTopics = () => {
  return db
    .query('SELECT * FROM topics;')
    .then((result) => {
      return result.rows;
    });
};