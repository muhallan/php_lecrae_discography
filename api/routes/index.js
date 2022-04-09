const express = require('express');
const router = express.Router();

const albumsController = require('../controllers/albums.controller');
const songsController = require('../controllers/songs.controller');

router.route("/albums")
    .get(albumsController.getAll)
    .post(albumsController.addOne);

router.route("/albums/:albumId")
    .get(albumsController.getOne)
    .delete(albumsController.deleteOne)
    .put(albumsController.fullUpdateOne)
    .patch(albumsController.partialUpdateOne);

router.route("/albums/:albumId/songs")
    .get(songsController.getAll)
    .post(songsController.addOne);

router.route("/albums/:albumId/songs/:songId")
    .get(songsController.getOne)
    .delete(songsController.deleteOne)
    .put(songsController.fullUpdateOne)
    .patch(songsController.partialUpdateOne);
    

module.exports = router;
