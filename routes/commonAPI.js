var express = require("express");
const config = require("../database/db_config");
var sql = require("mssql");
var router = express.Router();

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

router.get("/get_defect_categories", async function (req, res, next) {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = "SELECT * from defectCategories";

  request.query(sqlQuery, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result.recordset);
    }
  });
});

module.exports = router;
