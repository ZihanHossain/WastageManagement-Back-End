var express = require("express");
var router = express.Router();

const { getJobs } = require("../models/job.js");
const {
  getJobDetails,
  updateJobDetailsTransfer,
} = require("../models/jobDetails.js");
const { transferToHr } = require("../models/transfers.js");

router.get("/get_jobs", async function (req, res, next) {
  try {
    const response = await getJobs(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/get_job_details", async function (req, res, next) {
  try {
    const response = await getJobDetails(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/transfer", async function (req, res, next) {
  try {
    const response = await transferToHr(req);
    if (response > 0) {
      const response = await updateJobDetailsTransfer(req);
      res.status(200).send(response);
    } else {
      res.status(500).send(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
