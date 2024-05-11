const { pool, poolConnect } = require("../database/db_connect");

const getColors = async (req) => {
  await poolConnect;
  const request = pool.request();
  let sqlQuery = `SELECT * FROM colors WHERE color_name like '%${req.body.color}%'`;

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

const createColor = async (req) => {
  await poolConnect;
  const request = pool.request();
  let sqlQuery = `INSERT INTO Colors (color_name) VALUES ('${req.body.color}')`;

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
  getColors,
  createColor,
};
