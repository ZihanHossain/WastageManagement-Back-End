const { pool, poolConnect } = require("../database/db_connect");

const validateLogin = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT * FROM loginInfo WHERE user_name = '${req.body.eId}' and password = '${req.body.password}'`;

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
  validateLogin,
};
