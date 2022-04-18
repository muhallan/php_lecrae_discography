const express = require('express');
const router = express.Router();

const albumsController = require('../controllers/albums.controller');
const songsController = require('../controllers/songs.controller');

router.route("")
    .get(albumsController.getAll)
    .post(albumsController.addOne);

router.route("/:albumId")
    .get(albumsController.getOne)
    .delete(albumsController.deleteOne)
    .put(albumsController.fullUpdateOne)
    .patch(albumsController.partialUpdateOne);

router.route("/:albumId/songs")
    .get(songsController.getAll)
    .post(songsController.addOne);

router.route("/:albumId/songs/:songId")
    .get(songsController.getOne)
    .delete(songsController.deleteOne)
    .put(songsController.fullUpdateOne)
    .patch(songsController.partialUpdateOne);
    

module.exports = router;
