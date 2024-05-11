const { pool, poolConnect } = require("../database/db_connect");

const createInvoiceDetails = async (invoiceDetails, invoiceId) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery =
    "INSERT INTO invoiceDetails (invoice_id, job_details_id, qty, price) VALUES ";

  invoiceDetails.map((element) => {
    if (element.sellQty != null) {
      sqlQuery += `(${invoiceId}, ${element.jobDetailsId}, ${element.sellQty}, '${element.price}'),`;
    }
  });

  sqlQuery = sqlQuery.substr(0, sqlQuery.length - 1);

  return new Promise((resolve, reject) => {
    request.query(sqlQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result.rowsAffected);
      }
    });
  });
};

module.exports = {
  createInvoiceDetails,
};
