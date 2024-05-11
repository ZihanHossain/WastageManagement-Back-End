var express = require("express");
const { validateLogin } = require("../models/loginInfo");
var router = express.Router();

router.post("/validate_login_web", async function (req, res, next) {
  try {
    const response = await validateLogin(req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
