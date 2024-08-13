const { pool, poolConnect } = require("../database/db_connect");

const validateLogin = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT * FROM loginInfo WHERE user_name = '${req.body.eId}' and password = '${req.body.password}' and active = 1`;

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

const getUsers = async () => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT * FROM loginInfo`;

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

const updateUser = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `UPDATE logininfo
  SET user_name = '${req.userName}', password = '${req.password}', first_name = '${req.firstName}', last_name = '${req.lastName}' where id = ${req.id}`;

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

const addUser = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `
    INSERT INTO loginInfo (user_name, password, first_name, last_name, active)
    OUTPUT inserted.id
    VALUES ('${req.userName}', '${req.password}', '${req.firstName}', '${req.lastName}', 1);
  `;

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, async function (err, result) {
      if (err) {
        console.log(err);
        reject("error");
      } else {
        resolve(result.recordset[0]);
      }
    });
  });
};

const toggleUser = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `UPDATE loginInfo SET active = '${req.status}' WHERE id = ${req.id}`;

  console.log(sqlQuery);

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
  validateLogin,
  getUsers,
  updateUser,
  addUser,
  toggleUser,
};
