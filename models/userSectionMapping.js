const { pool, poolConnect } = require("../database/db_connect");

const getUserSectionMapping = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT section_id FROM UserSectionMapping WHERE user_id = '${req.id}'`;

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
  getUserSectionMapping,
};
