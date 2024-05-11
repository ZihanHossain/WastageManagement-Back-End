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
  let sqlQuery = `INSERT INTO Articles (article_name) VALUES ('${req.body.article}')`;

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject("error");
      } else {
        resolve(result.rowsAffected);
      }
    });
  });
};

module.exports = {
  getArticles,
  createArticle,
};
