var express = require("express");
const { getHrJobPending } = require("../models/common");
const { getCustomers } = require("../models/customers");
const { createInvoice } = require("../models/invoices");
const { createInvoiceDetails } = require("../models/invoiceDetails");
var router = express.Router();

router.get("/get_hr_job_pending", async function (req, res, next) {
  try {
    const response = await getHrJobPending(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/get_customers", async function (req, res, next) {
  try {
    const response = await getCustomers(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/createInvoice", async function (req, res, next) {
  let [rowsAffected, invoiceId] = await createInvoice(req); //rowsEffected stores how many rows were inserted and insertedId stores the last inserted id (order id)
  if (rowsAffected > 0) {
    let rowsAffected = await createInvoiceDetails(
      req.body.sellDetails,
      invoiceId
    );
    if (rowsAffected > 0) {
      res.status(201).json({ message: "Resource created successfully" });
    } else {
      res.status(500).json({ message: "Invoice Details not created" });
    }
  } else {
    res.status(500).json({ message: "Invoice not created" });
  }
});

module.exports = router;
