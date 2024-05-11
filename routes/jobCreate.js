var express = require("express");
const config = require("../database/db_config");
var sql = require("mssql");
var router = express.Router();

const { getArticles, createArticle } = require("../models/article.js");
const { createOrder, getOrder } = require("../models/order.js");
const { createJob, getJobs } = require("../models/job.js");
const { getColors, createColor } = require("../models/color.js");
const { createJobDetails } = require("../models/jobDetails.js");

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

//this API gets all the master data for Job Create screen
router.get("/get_master_data", async function (req, res, next) {
  await poolConnect;

  const request = pool.request();

  let sqlQuery =
    "SELECT * FROM defectCategories; SELECT * FROM wastageTypes; SELECT * FROM sections";

  request.query(sqlQuery, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      // Access the first query result
      const defectCategories = result.recordset;

      // Access the second query result
      const wastageTypes = result.recordsets[1];

      // Access the third query result
      const sections = result.recordsets[2];

      res.send({ defectCategories, wastageTypes, sections });
    }
  });
});

//this API gets all the defects based on defectCatagory id and jobType id
router.post("/get_defects", async function (req, res, next) {
  await poolConnect;

  const request = pool.request();

  let sqlQuery = `SELECT * FROM defects WHERE category_id = ${req.body.defectCategory} AND type_id = ${req.body.jobType}`;

  request.query(sqlQuery, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result.recordset);
    }
  });
});

//this API creates the job based on provided data
router.post("/create_job", async function (req, res, next) {
  let [rowsAffected, orderId] = await createOrder(req); //rowsEffected stores how many rows were inserted and insertedId stores the last inserted id (order id)
  if (rowsAffected > 0) {
    let [rowsAffected, jobId] = await createJob(req, orderId);
    if (rowsAffected > 0) {
      let rowsAffected = await createJobDetails(req.body.jobDetails, jobId);
      if (rowsAffected > 0) {
        res.status(201).json({ message: "Resource created successfully" });
      }
    }
  }
});

router.post("/get_taps_order", async function (req, res, next) {
  try {
    const response = await getOrder(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/get_order", async function (req, res, next) {
  try {
    const response = await getOrder(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/get_articles", async function (req, res, next) {
  try {
    const response = await getArticles(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/create_article", async function (req, res, next) {
  try {
    const response = await createArticle(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/get_colors", async function (req, res, next) {
  try {
    const response = await getColors(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/create_color", async function (req, res, next) {
  try {
    const response = await createColor(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
