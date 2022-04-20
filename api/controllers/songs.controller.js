const mongoose = require('mongoose');
const Album = mongoose.model(process.env.ALBUM_MODEL);

const getAll = (req, res) => {
    const albumId = req.params.albumId;

    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_ALBUM_ID};
        res.status(response.status).json(response.message);
    } else {
        Album.findById(albumId).select("songs").exec()
            .then((album) => {
                makeAllSongsResponse(album, albumId, response, res);
            })
            .catch(err => makeErrorResponse(err, res));
    }
};

const makeErrorResponse = (err, res) => {
    res.status(process.env.INTERNAL_ERROR_STATUS_CODE).json({error: err});
};

const makeAllSongsResponse = (album, albumId, response, res) => {
    if (!album) {
        response.status = process.env.NOT_FOUND_STATUS_CODE;
        response.message = {message: process.env.ALBUM_WITH_ID + albumId + process.env.NOT_FOUND};
    } else {
        response.status = process.env.SUCCESS_RESPONSE_STATUS_CODE;
        response.message = {songs: album.songs};
    }
    res.status(response.status).json(response.message);
};

const addOne = (req, res) => {
    const albumId = req.params.albumId;

    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_ALBUM_ID};
    } else {
        Album.findById(albumId).select('songs').exec()
            .then(album => fetchAlbumCallback(album, albumId, req, res))
            .catch(err => makeErrorResponse(err, res));
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
};

const fetchAlbumCallback = (album, albumId, req, res) => {
    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };
    if (!album) {
        response.status = process.env.NOT_FOUND_STATUS_CODE;
        response.message = {message: process.env.ALBUM_WITH_ID + albumId + process.env.NOT_FOUND};   
    } else {
        _addSong(req, res, album, response);
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
};

const _addSong = (req, res, album, response) => {
    let newSong = {};
    if (req.body && req.body.name && req.body.writers) {
        const writers = req.body.writers;
        if (!Array.isArray(writers) || !writers.length) {
            response.status = process.env.USER_ERROR_STATUS_CODE;
            response.message = {message: process.env.WRITERS_ARE_STRINGS_ARRAY};
        } else {
            newSong.name = req.body.name;
            newSong.writers = req.body.writers;
            album.songs.push(newSong);

            album.save()
                .then(updatedAlbum => saveAlbumCallback(res, updatedAlbum))
                .catch(err => makeErrorResponse(err, res));
        }
    } else {
        response.status = process.env.INTERNAL_ERROR_STATUS_CODE;
        response.message = {message: process.env.SONG_HAS_NAME_WRITERS};
    }
    
};

const saveAlbumCallback = (res, updatedAlbum) => {
    res.status(process.env.USER_CREATED_STATUS_CODE).json(updatedAlbum.songs);
};


const getOne = (req, res) => {
    const albumId = req.params.albumId;
    const songId = req.params.songId;

    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_ALBUM_ID};
    } else if (!mongoose.isValidObjectId(songId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_SONG_ID};
    } else {
        Album.findById(albumId).select("songs").exec()
            .then(album => getAlbumSongCallback(album, res, response, albumId, songId))
            .catch(err => makeErrorResponse(err, res));
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
};

const getAlbumSongCallback = (album, res, response, albumId, songId) => {
    if (!album) {
        response.status = process.env.NOT_FOUND_STATUS_CODE;
        response.message = {message: process.env.ALBUM_WITH_ID + albumId + process.env.NOT_FOUND};
    } else {
        const song = album.songs.id(songId);
        if (!song) {
            response.status = process.env.NOT_FOUND_STATUS_CODE;
            response.message = {message: process.env.SONG_WITH_ID + songId + process.env.NOT_FOUND};
        } else {
            response.status = process.env.SUCCESS_RESPONSE_STATUS_CODE;
            response.message = song;
        }
    }
    res.status(response.status).json(response.message);
}

const deleteOne = (req, res) => {
    const albumId = req.params.albumId;
    const songId = req.params.songId;

    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_ALBUM_ID};
    } else if (!mongoose.isValidObjectId(songId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_SONG_ID};
    } else {
        Album.findById(albumId).select("songs").exec()
            .then(album => getAlbumSongForDeleteCallback(album, res, albumId, songId))
            .catch(err => makeErrorResponse(err, res));
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } 
};

const getAlbumSongForDeleteCallback = (album, res, albumId, songId) => {
    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (!album) {
        response.status = process.env.NOT_FOUND_STATUS_CODE;
        response.message = {message: process.env.ALBUM_WITH_ID + albumId + process.env.NOT_FOUND};
    } else {
        const song = album.songs.id(songId);
        if (!song) {
            response.status = process.env.NOT_FOUND_STATUS_CODE;
            response.message = {message: process.env.SONG_WITH_ID + songId + process.env.NOT_FOUND};
        } else {
            let songs = album.songs;
            songs = songs.filter(aSong => aSong.id !== songId);
            album.songs = songs;
            album.save()
                .then((updatedAlbum) => saveAlbumDeleteSongCallback(res))
                .catch(err => makeErrorResponse(err, res));
        }
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
}

const saveAlbumDeleteSongCallback = (res) => {
    res.status(process.env.SUCCESS_RESPONSE_STATUS_CODE).json({message: process.env.SONG_REMOVED_SUCCESS});
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
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_ALBUM_ID};
    } else if (!mongoose.isValidObjectId(songId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_SONG_ID};
    } else {
        Album.findById(albumId).select("songs").exec()
            .then((album) => {
                getAlbumSongForUpdateCallback(album, res, req, albumId, songId, setSongUpdateDetails)
            })
            .catch(err => makeErrorResponse(err, res));
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
}

const getAlbumSongForUpdateCallback = (album, res, req, albumId, songId, setSongUpdateDetails) => {
    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (!album) {
        response.status = process.env.NOT_FOUND_STATUS_CODE;
        response.message = {message: process.env.ALBUM_WITH_ID + albumId + process.env.NOT_FOUND};
    } else {
        const song = album.songs.id(songId);
        if (!song) {
            response.status = process.env.NOT_FOUND_STATUS_CODE;
            response.message = {message: process.env.SONG_WITH_ID + songId + process.env.NOT_FOUND};
        } else {
            _updateSong(req, res, album, song, songId, response, setSongUpdateDetails);
        }
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
};

const _updateSong = (req, res, album, song, songId, response, setSongUpdateDetails) => {
    setSongUpdateDetails(req, song, response);

    if (response.status === process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        album.save()
            .then(updatedAlbum => saveAlbumSongUpdateCallback(res, updatedAlbum, songId))
            .catch(err => makeErrorResponse(err, res));
    }
}

const setFullSongUpdateDetails = (req, song, response) => {
    if (req.body && req.body.name && req.body.writers) {
        const writers = req.body.writers;
        if (!Array.isArray(writers) || !writers.length) {
            response.status = process.env.USER_ERROR_STATUS_CODE;
            response.message = {message: process.env.WRITERS_ARE_STRINGS_ARRAY};
        } else {
            song.name = req.body.name;
            song.writers = req.body.writers;
        }
    } else {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.SONG_HAS_NAME_WRITERS};
    }
};

const setPartialSongUpdateDetails = (req, song, response) => {
    if (req.body) {
        song.name = req.body.name || song.name;

        if (req.body.writers) {
            const writers = req.body.writers;
            if (!Array.isArray(writers) || !writers.length) {
                response.status = process.env.USER_ERROR_STATUS_CODE;
                response.message = {message: process.env.WRITERS_ARE_STRINGS_ARRAY};
            } else {
                song.writers = writers;
            }
        }
    } else {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.NO_JSON_PROVIDED};
    }
};

const saveAlbumSongUpdateCallback = (res, updatedAlbum, songId) => {
    res.status(process.env.SUCCESS_RESPONSE_STATUS_CODE).json(updatedAlbum.songs.id(songId));
};

module.exports = {
    getAll, 
    addOne,
    getOne,
    deleteOne,
    fullUpdateOne,
    partialUpdateOne
}
