const mongoose = require('mongoose');
const Album = mongoose.model(process.env.ALBUM_MODEL);

const getAll = (req, res) => {
    const albumId = req.params.albumId;

    const response = {
        status: 200,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = 400;
        response.message = {message: "Invalid album ID provided"};
        res.status(response.status).json(response.message);
    } else {
        Album.findById(albumId).select("songs").exec((err, album) => makeAllSongsResponse(err, album, response, res));
    }
};

const makeAllSongsResponse = (err, album, response, res) => {
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else if (!album) {
        response.status = 401;
        response.message = {message: "Album with id " + albumId + " not found"};
    } else {
        response.status = 200;
        response.message = {songs: album.songs};
    }
    res.status(response.status).json(response.message);
};

module.exports = {
    getAll
}
