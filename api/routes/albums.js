const express = require('express');
const router = express.Router();

const albumsController = require('../controllers/albums.controller');
const songsController = require('../controllers/songs.controller');
const authController = require('../controllers/authentication.controller');

router.route("")
    .get(authController.authenticate, albumsController.getAll)
    .post(authController.authenticate, albumsController.addOne);

router.route("/:albumId")
    .get(authController.authenticate, albumsController.getOne)
    .delete(authController.authenticate, albumsController.deleteOne)
    .put(authController.authenticate, albumsController.fullUpdateOne)
    .patch(authController.authenticate, albumsController.partialUpdateOne);

router.route("/:albumId/songs")
    .get(authController.authenticate, songsController.getAll)
    .post(authController.authenticate, songsController.addOne);

router.route("/:albumId/songs/:songId")
    .get(authController.authenticate, songsController.getOne)
    .delete(authController.authenticate, songsController.deleteOne)
    .put(authController.authenticate, songsController.fullUpdateOne)
    .patch(authController.authenticate, songsController.partialUpdateOne);
    

module.exports = router;
