const express = require('express');
const router = express.Router();

const albumsController = require('../controllers/albums.controller');

router.route("/albums")
    .get(albumsController.getAll)
    .post(albumsController.addOne);
    

module.exports = router;
