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
  const colorName = req.body.color;

  // Use parameterized query to prevent SQL injection
  const sqlQuery = `INSERT INTO Colors (color_name) VALUES (@colorName)`;

  request.input("colorName", colorName);

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, (err, result) => {
      if (err) {
        if (err.number === 2627 || err.number === 2601) {
          // Unique key violation error
          console.log(`Unique key violation for color_name: ${colorName}`);
          resolve({ message: "Color already exists", rowsAffected: 0 });
        } else {
          console.log(err);
          reject("error");
        }
      } else {
        resolve({
          message: "Color created successfully",
          rowsAffected: result.rowsAffected,
        });
      }
    });
  });
};

module.exports = {
  getColors,
  createColor,
};
