const { pool, poolConnect } = require("../database/db_connect");

const getSections = async () => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT * FROM sections`;

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, async function (err, result) {
      if (err) {
        console.log(err);
        reject("error");
      } else {
        resolve(result.recordset);
      }
    });
  });
};

module.exports = {
  getSections,
};
