const { pool, poolConnect } = require("../database/db_connect");

const getHrJobPending = async (req) => {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT * FROM (SELECT JD.ID as jdId, J.job_number, DC.category_name, S.section_name, o.order_number, O.fabric_yarn_name, O.color_name, WS.type_name, D.defect_name, J.REMARKS, ISNULL(ID.qty, 0) as invoiceQty, JD.*, CONVERT(varchar, created_date, 23) as created_date FROM JOBS J INNER JOIN jobDetails JD ON JD.job_id = J.ID INNER JOIN sections S ON S.ID = J.section_id
  INNER JOIN wastageTypes WS ON WS.id = J.type_id INNER JOIN orders O ON O.ID = J.order_id INNER JOIN defects D ON D.ID = JD.defect_id INNER JOIN defectCategories DC ON DC.ID = D.category_id LEFT OUTER JOIN (SELECT ID.job_details_id, sum(ID.qty) as qty FROM invoiceDetails ID group by ID.job_details_id) ID ON ID.job_details_id = jd.id) a WHERE a.invoiceQty <> a.transferred_to_hr`;

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
  getHrJobPending,
};
