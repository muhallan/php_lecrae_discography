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
        Album.findById(albumId).select("songs").exec()
            .then((album) => {
                makeAllSongsResponse(album, response, res);
            })
            .catch(err => makeErrorResponse(err, res));
    }
};

const makeErrorResponse = (err, res) => {
    res.status(500).json({error: err});
};

const makeAllSongsResponse = (album, response, res) => {
    if (!album) {
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
        Album.findById(albumId).select('songs').exec()
            .then(album => fetchAlbumCallback(album, albumId, req, res))
            .catch(err => makeErrorResponse(err, res));
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
};

const fetchAlbumCallback = (album, albumId, req, res) => {
    const response = {
        status: 200,
        message: {}
    };
    if (!album) {
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

            album.save()
                .then(updatedAlbum => saveAlbumCallback(res, updatedAlbum))
                .catch(err => makeErrorResponse(err, res));
        }
    } else {
        response.status = 500;
        response.message = {message: "Incomplete data provided. A song requires a name and writers"};
    }
    
};

const saveAlbumCallback = (res, updatedAlbum) => {
    res.status(201).json(updatedAlbum.songs);
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
        Album.findById(albumId).select("songs").exec()
            .then(album => getAlbumSongCallback(album, res, response, albumId, songId))
            .catch(err => makeErrorResponse(err, res));
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
};

const getAlbumSongCallback = (album, res, response, albumId, songId) => {
    if (!album) {
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
        Album.findById(albumId).select("songs").exec()
            .then(album => getAlbumSongForDeleteCallback(album, res, albumId, songId))
            .catch(err => makeErrorResponse(err, res));
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    } 
};

const getAlbumSongForDeleteCallback = (album, res, albumId, songId) => {
    const response = {
        status: 200,
        message: {}
    };

    if (!album) {
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
            album.save()
                .then((updatedAlbum) => saveAlbumDeleteSongCallback(res))
                .catch(err => makeErrorResponse(err, res));
        }
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
}

const saveAlbumDeleteSongCallback = (res) => {
    res.status(200).json({message: "Song removed successfully"});
};

const fullUpdateOne = (req, res) => {
    updateOne(req, res, setFullSongUpdateDetails);
};

const partialUpdateOne = (req, res) => {
    updateOne(req, res, setPartialSongUpdateDetails);
};

const updateOne = (req, res, setSongUpdateDetails) => {
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
        Album.findById(albumId).select("songs").exec()
            .then((album) => {
                getAlbumSongForUpdateCallback(album, res, req, albumId, songId, setSongUpdateDetails)
            })
            .catch(err => makeErrorResponse(err, res));
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
}

const getAlbumSongForUpdateCallback = (album, res, req, albumId, songId, setSongUpdateDetails) => {
    const response = {
        status: 200,
        message: {}
    };

    if (!album) {
        response.status = 404;
        response.message = {message: "Album with id " + albumId + " not found"};
    } else {
        const song = album.songs.id(songId);
        if (!song) {
            response.status = 404;
            response.message = {message: "Song with id " + songId + " not found"};
        } else {
            _updateSong(req, res, album, song, songId, response, setSongUpdateDetails);
        }
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
};

const _updateSong = (req, res, album, song, songId, response, setSongUpdateDetails) => {
    setSongUpdateDetails(req, song, response);

    if (response.status === 200) {
        album.save()
            .then(updatedAlbum => saveAlbumSongUpdateCallback(res, updatedAlbum, songId))
            .catch(err => makeErrorResponse(err, res));
    }
}

const setFullSongUpdateDetails = (req, song, response) => {
    if (req.body && req.body.name && req.body.writers) {
        const writers = req.body.writers;
        if (!Array.isArray(writers) || !writers.length) {
            response.status = 400;
            response.message = {message: "Writers must be provided as an array of strings"};
        } else {
            song.name = req.body.name;
            song.writers = req.body.writers;
        }
    } else {
        response.status = 400;
        response.message = {message: "Incomplete data provided. A song requires a name and writers"};
    }
};

const setPartialSongUpdateDetails = (req, song, response) => {
    if (req.body) {
        song.name = req.body.name || song.name;

        if (req.body.writers) {
            const writers = req.body.writers;
            if (!Array.isArray(writers) || !writers.length) {
                response.status = 400;
                response.message = {message: "Writers must be provided as an array of strings"};
            } else {
                song.writers = writers;
            }
        }
    } else {
        response.status = 400;
        response.message = {message: "No JSON body provided"};
    }
};

const saveAlbumSongUpdateCallback = (res, updatedAlbum, songId) => {
    res.status(200).json(updatedAlbum.songs.id(songId));
};

module.exports = {
    getAll, 
    addOne,
    getOne,
    deleteOne,
    fullUpdateOne,
    partialUpdateOne
}
