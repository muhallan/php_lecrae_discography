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
        response.status = 404;
        response.message = {message: "Album with id " + albumId + " not found"};
    } else {
        response.status = 200;
        response.message = {songs: album.songs};
    }
    res.status(response.status).json(response.message);
};

const addOne = (req, res) => {
    const albumId = req.params.albumId;

    const response = {
        status: 200,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = 400;
        response.message = {message: "Invalid album ID provided"};
    } else {
        Album.findById(albumId).select('songs').exec((err, album) => fetchAlbumCallback(err, album, albumId, req, res, response));
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
};

const fetchAlbumCallback = (err, album, albumId, req, res) => {
    const response = {
        status: 200,
        message: {}
    };
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else if (!album) {
        response.status = 404;
        response.message = {message: "Album with id " + albumId + " not found"};   
    } else {
        _addSong(req, res, album, response);
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
};

const _addSong = (req, res, album, response) => {
    let newSong = {};
    if (req.body && req.body.name && req.body.writers) {
        const writers = req.body.writers;
        if (!Array.isArray(writers) || !writers.length) {
            response.status = 400;
            response.message = {message: "Writers must be provided as an array of strings"};
        } else {
            newSong.name = req.body.name;
            newSong.writers = req.body.writers;
            album.songs.push(newSong);

            album.save((err, updatedAlbum) => saveAlbumCallback(err, res, updatedAlbum, response));
        }
    } else {
        response.status = 500;
        response.message = {message: "Incomplete data provided. A song requires a name and writers"};
    }
    
};

const saveAlbumCallback = (err, res, updatedAlbum, response) => {
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else {
        response.status = 201;
        response.message = updatedAlbum.songs;
    }
    res.status(response.status).json(response.message);
};


const getOne = (req, res) => {
    const albumId = req.params.albumId;
    const songId = req.params.songId;

    const response = {
        status: 200,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = 400;
        response.message = {message: "Invalid album ID provided"};
    } else if (!mongoose.isValidObjectId(songId)) {
        response.status = 400;
        response.message = {message: "Invalid song ID provided"};
    } else {
        Album.findById(albumId).select("songs").exec((err, album) => getAlbumSongCallback(err, album, res, response, albumId, songId));
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
};

const getAlbumSongCallback = (err, album, res, response, albumId, songId) => {
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else if (!album) {
        response.status = 404;
        response.message = {message: "Album with id " + albumId + " not found"};
    } else {
        const song = album.songs.id(songId);
        if (!song) {
            response.status = 404;
            response.message = {message: "Song with id " + songId + " not found"};
        } else {
            response.status = 200;
            response.message = song;
        }
    }
    res.status(response.status).json(response.message);
}

const deleteOne = (req, res) => {
    const albumId = req.params.albumId;
    const songId = req.params.songId;

    const response = {
        status: 200,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = 400;
        response.message = {message: "Invalid album ID provided"};
    } else if (!mongoose.isValidObjectId(songId)) {
        response.status = 400;
        response.message = {message: "Invalid song ID provided"};
    } else {
        Album.findById(albumId).select("songs").exec((err, album) => getAlbumSongForDeleteCallback(err, album, res, albumId, songId));
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    } 
};

const getAlbumSongForDeleteCallback = (err, album, res, albumId, songId) => {
    const response = {
        status: 200,
        message: {}
    };

    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else if (!album) {
        response.status = 404;
        response.message = {message: "Album with id " + albumId + " not found"};
    } else {
        const song = album.songs.id(songId);
        if (!song) {
            response.status = 404;
            response.message = {message: "Song with id " + songId + " not found"};
        } else {
            let songs = album.songs;
            songs = songs.filter(aSong => aSong.id !== songId);
            album.songs = songs;
            album.save((err, updatedAlbum) => saveAlbumDeleteSongCallback(err, res));
        }
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
}

const saveAlbumDeleteSongCallback = (err, res) => {
    const response = {};
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else {
        response.status = 200;
        response.message = {message: "Song removed successfully"};
    }
    res.status(response.status).json(response.message);
};

module.exports = {
    getAll, 
    addOne,
    getOne,
    deleteOne
}
