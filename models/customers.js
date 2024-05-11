const { pool, poolConnect } = require("../database/db_connect");

const getCustomers = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT * FROM customers WHERE type = ${req.body.type}`;

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result.recordset);
      }
    });
  });
};

module.exports = {
  getCustomers,
};
