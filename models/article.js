const { pool, poolConnect } = require("../database/db_connect");

const getArticles = async (req) => {
  await poolConnect;
  const request = pool.request();
  let sqlQuery = `SELECT * FROM articles WHERE article_name like '%${req.body.article}%'`;

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject("error");
      } else {
        resolve(result.recordset);
      }
    });
  });
};

const createArticle = async (req) => {
  await poolConnect;
  const request = pool.request();
  const articleName = req.body.article;

  // Use parameterized query to prevent SQL injection
  const sqlQuery = `INSERT INTO Articles (article_name) VALUES (@articleName)`;

  request.input("articleName", articleName);

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, (err, result) => {
      if (err) {
        if (err.number === 2627 || err.number === 2601) {
          // Unique key violation error
          console.log(`Unique key violation for article_name: ${articleName}`);
          resolve({ message: "Article already exists", rowsAffected: 0 });
        } else {
          console.log(err);
          reject("error");
        }
      } else {
        resolve({
          message: "Article created successfully",
          rowsAffected: result.rowsAffected,
        });
      }
    });
  });
};

module.exports = {
  getArticles,
  createArticle,
};
