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

const deleteUserSectionMapping = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `DELETE FROM UserSectionMapping WHERE user_id = ${req.id}`;

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, async function (err, result) {
      if (err) {
        console.log(err);
        reject("error");
      } else {
        resolve(result.rowsAffected);
      }
    });
  });
};

const addUserSectionMapping = async (user, req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `INSERT INTO UserSectionMapping VALUES `;

  req.checked.map((element) => {
    sqlQuery += `(${user.id}, ${element}),`;
  });

  sqlQuery = sqlQuery.substr(0, sqlQuery.length - 1);

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, async function (err, result) {
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
  getUserSectionMapping,
  deleteUserSectionMapping,
  addUserSectionMapping,
};
