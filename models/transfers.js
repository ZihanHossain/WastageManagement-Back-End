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

const transferToHr = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery =
    "INSERT INTO transfers (job_details_id, transfer_qty, transfer_to, transfer_date, transfer_by) VALUES ";

  req.body.transferDetails.forEach((element) => {
    if (element.transferQty != null) {
      sqlQuery += `(${element.jobDetailsId}, ${
        element.transferQty
      }, 1, '${getDateTime()}', ${req.body.transfer_by}),`;
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
  transferToHr,
};
