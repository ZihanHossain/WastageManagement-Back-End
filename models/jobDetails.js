const { pool, poolConnect } = require("../database/db_connect");

const getJobDetails = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT jd.id as jdId, jd.qty, jd.transferred_to_hr, d.* FROM jobDetails jd
  INNER JOIN defects d ON d.id = jd.defect_id
  WHERE jd.job_id = ${req.body.jobId}`;

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

const createJobDetails = async (jobDetails, jobId) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery =
    "INSERT INTO jobDetails (job_id, defect_id, qty, transferred_to_hr, comment) VALUES ";

  jobDetails.forEach((element) => {
    if (element.qty != null) {
      sqlQuery += `(${jobId}, ${element.defect_id}, ${element.qty}, 0, '${element.comment}'),`;
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

const updateJobDetailsTransfer = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = ``;
  req.body.transferDetails.forEach((element) => {
    sqlQuery += `UPDATE jobDetails
  SET transferred_to_hr = (SELECT SUM(transfer_qty) FROM transfers WHERE job_details_id = ${element.jobDetailsId})
  WHERE id = ${element.jobDetailsId};`;
  });

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
  getJobDetails,
  createJobDetails,
  updateJobDetailsTransfer,
};
