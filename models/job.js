const { pool, poolConnect } = require("../database/db_connect");

//this function is to get date and time in YEAR/MO/DY HH:MM:SS formate
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

const getJobs = async () => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT CAST(j.created_date AS DATETIME) as create_date, j.*, s.section_name,
  t.type_name, a.transferred_to_hr, a.active_qty FROM jobs j INNER JOIN sections s ON s.id = j.section_id
INNER JOIN wastageTypes t ON t.id = j.type_id INNER JOIN ( SELECT job_id, SUM(transferred_to_hr) AS transferred_to_hr,
    (SUM(qty) - SUM(transferred_to_hr)) AS active_qty FROM jobDetails GROUP BY job_id ) a ON a.job_id = j.id
WHERE a.active_qty <> 0 order by j.id DESC`;

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

const createJob = async (req, orderId) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `INSERT INTO jobs (job_number, order_id, section_id, type_id, remarks, created_date, created_by)
    OUTPUT INSERTED.id
    VALUES(CONCAT('JB', FORMAT(IDENT_CURRENT('jobs'), '00000000')), ${orderId}, ${
    req.body.section
  }, ${req.body.jobType}, '${req.body.remarks}', '${getDateTime()}', ${
    req.body.created_by
  })`;

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
  createJob,
  getJobs,
};
