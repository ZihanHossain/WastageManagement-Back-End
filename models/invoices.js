const { pool, poolConnect } = require("../database/db_connect");

function getDateTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const createInvoice = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `INSERT INTO invoices (invoice_number, invoice_type, sold_to, create_date, sold_by)
    OUTPUT INSERTED.id
    VALUES(CONCAT('SQ-', FORMAT(IDENT_CURRENT('invoices'), '00000000')), '${
      req.body.type
    }', '${req.body.customer}', '${getDateTime()}', ${req.body.sold_by})`;

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
  createInvoice,
};
