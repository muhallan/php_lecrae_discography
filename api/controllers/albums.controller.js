const mongoose = require('mongoose');
const Album = mongoose.model(process.env.ALBUM_MODEL);


const getAll = (req, res) => {
    let offset = 0;
    let count = 5;
    const maxCount = 10;

    const response = {
        status: 200,
        message: {}
    };
    let query = {};

    if (req.query && req.query.count) {
        count = parseInt(req.query.count);
    }
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset);
    }
    if (req.query && req.query.q) {
        query = {title: new RegExp(`^${req.query.q}$`, "i")};
    }

    if (isNaN(count) || isNaN(offset)) {
        response.status = 400;
        response.message = {message: "count and offset must be numbers"};
    } else if (count > maxCount) {
        response.status = 400;
        response.message = {message: "count must be less than or equal to " + maxCount};
    }

    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    } else {
        Album.find(query).skip(offset).limit(count).exec((err, albums) => makeAllAlbumsResponse(err, albums, response, res));
    }
};

const makeAllAlbumsResponse = (err, albums, response, res) => {
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else {
        response.status = 200;
        response.message = {albums: albums};
    }
    res.status(response.status).json(response.message);
};


const addOne = (req, res) => {
    const response = {
        status: 200,
        message: {}
    };

    if (req.body && req.body.title && req.body.year) {
        const year = parseInt(req.body.year);
        const currentYear = new Date().getFullYear();
        const validatedSongs = _getSongsFromBody(req, response);
        if (isNaN(year)) {
            response.status = 400;
            response.message = {message: "year should be a number"};
        } else if (year < 2004 || year > currentYear) {
            response.status = 400;
            response.message = {message: "year should be between 2004 and " + currentYear};
        } else if (response.status === 200) {
            const newAlbum = {
                title: req.body.title,
                year: year,
                songs: []
            };
            if (validatedSongs) {
                newAlbum.songs = validatedSongs;
            }
            Album.create(newAlbum, (err, album) => makeCreateAlbumResponse(err, album, response, res));
        }
    } else {
        response.status = 400;
        response.message = {message: "Album requires a title and a year"};
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
};

const makeCreateAlbumResponse = (err, album, response, res) => {
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else {
        response.status = 201;
        response.message = album;
    }
    res.status(response.status).json(response.message);
}

const getOne = (req, res) => {
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
        Album.findById(albumId).exec((err, album) => makeSingleAlbumResponse(err, album, response, res, albumId));
    }

}

const makeSingleAlbumResponse = (err, album, response, res, albumId) => {
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else if (!album) {
        response.status = 404;
        response.message = {message: "Album with id " + albumId + " not found"};
    } else {
        response.status = 200;
        response.message = album;
    }
    res.status(response.status).json(response.message);
}

const deleteOne = (req, res) => {
    const albumId = req.params.albumId;

    const response = {
        status: 200,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = 400;
        response.message = {message: "Invalid album ID provided"};
    } else {
        Album.findByIdAndDelete(albumId).exec((err, album) => deleteAlbumCallback(err, album, albumId, res));
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
};

const deleteAlbumCallback = (err, album, albumId, res) => {
    const response = {};
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else if(!album) {
        response.status = 404;
        response.message = {message: "Album with id " + albumId + " not found"};
    } else {
        response.status = 200;
        response.message = {message: "Album deleted successfully"};
    }
    res.status(response.status).json(response.message);
}

const updateOne = (req, res, setAlbumUpdateDetails) => {
    const albumId = req.params.albumId;
    
    const response = {
        status: 200,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = 400;
        response.message = {message: "Invalid album ID provided"};
    } else {
        Album.findById(albumId).exec((err, album) => getAlbumForUpdate(err, album, req, res, albumId, setAlbumUpdateDetails));
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
}


const fullUpdateOne = (req, res) => {
    updateOne(req, res, setFullAlbumUpdateDetails);
}

const partialUpdateOne = (req, res) => {
    updateOne(req, res, setPartialAlbumUpdateDetails);
};

const getAlbumForUpdate = (err, album, req, res, albumId, setAlbumUpdateDetails) => {
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
        setAlbumUpdateDetails(req, album, response);

        if (response.status === 200) {
            album.save((err, updatedAlbum) => saveAlbumCallback(err, res, updatedAlbum, response));
        }
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
};

const setFullAlbumUpdateDetails = (req, album, response) => {
    if (req.body && req.body.title && req.body.year) {
        const year = parseInt(req.body.year);
        const currentYear = new Date().getFullYear();
        if (isNaN(year)) {
            response.status = 400;
            response.message = {message: "year should be a number"};
        } else if (year < 2004 || year > currentYear) {
            response.status = 400;
            response.message = {message: "year should be between 2004 and " + currentYear};
        } else {
            album.title = req.body.title;
            album.year = year;
        }
    } else {
        response.status = 400;
        response.message = {message: "Album requires a title and a year"};
    }

    const validatedSongs = _getSongsFromBody(req, response);
    album.songs = validatedSongs;
};

const _getSongsFromBody = (req, response) => {
    const isValid = true;
    const validatedSongs = [];
    if (req.body && req.body.songs) {
        const songs = req.body.songs;
        for (let song of songs) {
            if (_validateSong(song, response)) {
                validatedSongs.push(song);
            } else {
                isValid = false;
                break;
            }
        }
    } 
    if (isValid) {
        return validatedSongs;
    }
    return [];
}

const _validateSong = (song, response) => {
    if (song && song.name && song.writers) {
        const writers = song.writers;
        if (!Array.isArray(writers) || !writers.length) {
            response.status = 400;
            response.message = {message: "Writers must be provided as an array of strings"};
            return false;
        }
    } else {
        response.status = 500;
        response.message = {message: "Incomplete data provided. A song requires a name and writers"};
        return false;
    }
    return true;
}

const setPartialAlbumUpdateDetails = (req, album, response) => {
    
    if (req.body) {
        album.title = req.body.title || album.title;
        if (req.body.year) {
            const year = parseInt(req.body.year);
            const currentYear = new Date().getFullYear();
            if (isNaN(year)) {
                response.status = 400;
                response.message = {message: "year should be a number"};
            } else if (year < 2004 || year > currentYear) {
                response.status = 400;
                response.message = {message: "year should be between 2004 and " + currentYear};
            } else {
                album.year = year;
            }
        }
        const validatedSongs = _getSongsFromBody(req, response);
        if (validatedSongs && validatedSongs.length) {
            album.songs = validatedSongs;
        }
    } else {
        response.status = 400;
        response.message = {message: "No JSON body provided"};
    }
};

const saveAlbumCallback = (err, res, updatedAlbum, response) => {
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else {
        response.status = 200;
        response.message = updatedAlbum;
    }
    res.status(response.status).json(response.message);
};


module.exports = {
    getAll,
    addOne,
    getOne,
    deleteOne,
    fullUpdateOne,
    partialUpdateOne
}
