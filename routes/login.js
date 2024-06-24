var express = require("express");
const { validateLogin } = require("../models/loginInfo");
const { getUserSectionMapping } = require("../models/userSectionMapping");
const { getUserPermission } = require("../models/userPermission");
var router = express.Router();

router.post("/validate_login_web", async function (req, res, next) {
  try {
    const response = await validateLogin(req);
    if (response.length > 0) {
      const mappingResponse = await getUserSectionMapping(response[0]);
      const permissionResponse = await getUserPermission(response[0]);
      res.send([response[0], mappingResponse, permissionResponse]);
    } else {
      res.send(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
