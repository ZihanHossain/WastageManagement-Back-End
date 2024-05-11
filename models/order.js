const { pool, poolConnect } = require("../database/db_connect");

const getOrder = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT * FROM orders WHERE order_number = '${req.body.orderNumber}'`;

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

const createOrder = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `INSERT INTO orders (order_number, fabric_yarn_name, color_name)
    OUTPUT INSERTED.id
     VALUES ('${req.body.orderNumber}',
    '${req.body.article}', '${req.body.color}')`;

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, async function (err, result) {
      if (err) {
        console.log(err);
        reject("error");
      } else {
        const insertedId = await result.recordset[0].id;
        resolve([result.rowsAffected, insertedId]);
      }
    });
  });
};

module.exports = {
  getOrder,
  createOrder,
};
