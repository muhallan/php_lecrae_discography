const express = require('express');
const albumRoutes = require('./albums');
const userRoutes = require('./users');

const router = express.Router();
router.use("/albums", albumRoutes);
router.use("/users", userRoutes);

module.exports = router;
