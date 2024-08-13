var express = require("express");
const {
  getUsers,
  updateUser,
  addUser,
  toggleUser,
} = require("../models/loginInfo");
const { getSections } = require("../models/sections");
const {
  getUserSectionMapping,
  deleteUserSectionMapping,
  addUserSectionMapping,
} = require("../models/userSectionMapping");
var router = express.Router();

router.get("/get_users", async function (req, res, next) {
  try {
    const users = await getUsers();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/get_all_sections", async function (req, res, next) {
  try {
    const sections = await getSections();
    res.send(sections);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/get_user_section_mapping", async function (req, res, next) {
  try {
    const sections = await getUserSectionMapping(req.body);
    let sectionIds = [];
    sectionIds.push(
      ...sections.map((section) => {
        return section.section_id;
      })
    );
    res.send(sectionIds);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update_user", async function (req, res, next) {
  try {
    const updateResult = await updateUser(req.body);
    if (updateResult > 0) {
      const deleteResult = await deleteUserSectionMapping(req.body);
      if (deleteResult >= 0 && req.body.checked.length > 0) {
        const addMappingResult = await addUserSectionMapping(
          req.body,
          req.body
        );
        res.send("success");
      } else if (updateResult > 0 && req.body.checked.length < 1) {
        res.send("success");
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/add_user", async function (req, res, next) {
  try {
    const addResult = await addUser(req.body);
    if (
      addResult != null &&
      addResult !== undefined &&
      req.body.checked.length > 0
    ) {
      const addMappingResult = await addUserSectionMapping(addResult, req.body);
      res.send("success");
    } else if (
      addResult != null &&
      addResult !== undefined &&
      req.body.checked.length < 1
    ) {
      res.send("success");
    } else {
      res.send("error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/toggle_user", async function (req, res, next) {
  try {
    const toggleResult = await toggleUser(req.body);
    if (toggleResult > 0) {
      res.send("success");
    } else {
      res.send("error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
