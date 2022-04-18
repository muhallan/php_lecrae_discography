const express = require('express');
const router = express.Router();
const userController = require("../controllers/users.controllers");

router.route("/register")
      .post(userController.addOne);

router.route("/login")
      .post(userController.login);

module.exports = router;
